#include "EJApp.h"
#include "EJBindingBase.h"
#include "EJUtils/EJBindingTouchInput.h"
#include "EJUtils/EJBindingHttpRequest.h"
#include "EJCanvasContext.h"
#include "EJCanvasContextScreen.h"
#include "EJCocoa/NSObjectFactory.h"
#include "EJCocoa/NSAutoreleasePool.h"
#include "EJTimer.h"
#include <android/asset_manager_jni.h>

#include <sys/stat.h>

JSValueRef ej_global_undefined;
JSClassRef ej_constructorClass;

JSValueRef ej_getNativeClass(JSContextRef ctx, JSObjectRef object, JSStringRef propertyNameJS, JSValueRef* exception) {
 	size_t classNameSize = JSStringGetMaximumUTF8CStringSize(propertyNameJS);
    char* className = (char*)malloc(classNameSize);
    JSStringGetUTF8CString(propertyNameJS, className, classNameSize);
	
 	JSObjectRef obj = NULL;
 	NSString * fullClassName = new NSString();

 	fullClassName->initWithFormat("EJBinding%s",className);
 	EJBindingBase* pClass = (EJBindingBase*)NSClassFromString(fullClassName->getCString());
	if( pClass ) {
		obj = JSObjectMake( ctx, ej_constructorClass, (void *)pClass );
	} else {
		 NSLOG("%s is NULL ... ", fullClassName->getCString());
	}
	
    free(className);
    fullClassName->autorelease();
 	return obj ? obj : ej_global_undefined;
 }

JSObjectRef ej_callAsConstructor(JSContextRef ctx, JSObjectRef constructor, size_t argc, const JSValueRef argv[], JSValueRef* exception) {
	


	EJBindingBase* pClass = (EJBindingBase*)(JSObjectGetPrivate( constructor ));

	JSClassRef jsClass = EJApp::instance()->getJSClassForClass(pClass);

	JSObjectRef obj = JSObjectMake( ctx, jsClass, NULL );
	
 	EJBindingBase* instance = (EJBindingBase*)NSClassFromString(pClass->toString().c_str());
	instance->initWithContext(ctx, obj, argc, argv);

	JSObjectSetPrivate( obj, (void *)instance );
	
 	return obj;
 }




// ---------------------------------------------------------------------------------
// Ejecta Main Class implementation - this creates the JavaScript Context and loads
// the initial JavaScript source files

EJApp* EJApp::ejectaInstance = NULL;


EJApp::EJApp() : currentRenderingContext(0), screenRenderingContext(0), touchDelegate(0), touches(0), openGLContext(NULL), drawDelegate(NULL)
{
	NSPoolManager::sharedPoolManager()->push();

	landscapeMode = true;

	// Show the loading screen - commented out for now.
	// This causes some visual quirks on different devices, as the launch screen may be a 
	// different one than we loade here - let's rather show a black screen for 200ms...
	//NSString * loadingScreenName = [EJApp landscapeMode] ? @"Default-Landscape.png" : @"Default-Portrait.png";
	//loadingScreen = [[UIImageView alloc] initWithImage:[UIImage imageNamed:loadingScreenName]];
	//loadingScreen.frame = self.view.bounds;
	//[self.view addSubview:loadingScreen];
	
	paused = false;
	internalScaling = 1.0f;

	dataBundle = 0;

	timers = new EJTimerCollection();
	lockTouches = false;
	touches = NSArray::create();
	if (touches != NULL)
	{
		touches->retain();
	}

	// Create the global JS context and attach the 'Ejecta' object
		jsClasses = new NSDictionary();
		
		JSClassDefinition constructorClassDef = kJSClassDefinitionEmpty;
		constructorClassDef.callAsConstructor = ej_callAsConstructor;
		ej_constructorClass = JSClassCreate(&constructorClassDef);
		
		JSClassDefinition globalClassDef = kJSClassDefinitionEmpty;
		globalClassDef.getProperty = ej_getNativeClass;		
		JSClassRef globalClass = JSClassCreate(&globalClassDef);
		
		
		jsGlobalContext = JSGlobalContextCreate(NULL);
		ej_global_undefined = JSValueMakeUndefined(jsGlobalContext);
		JSValueProtect(jsGlobalContext, ej_global_undefined);
		JSObjectRef globalObject = JSContextGetGlobalObject(jsGlobalContext);
		
		JSObjectRef iosObject = JSObjectMake( jsGlobalContext, globalClass, NULL );
		JSObjectSetProperty(
			jsGlobalContext, globalObject, 
			JSStringCreateWithUTF8CString("Ejecta"), iosObject, 
			kJSPropertyAttributeDontDelete | kJSPropertyAttributeReadOnly, NULL
		);
		
		// Create the OpenGL ES2 Context
		// Android init GLView on java framework
		openGLContext = EJSharedOpenGLContext::getInstance();
		if(openGLContext != NULL) {
			openGLContext->retain();
		}
}


EJApp::~EJApp()
{
	pause();
	EJHttpClient::destroyInstance();
	//JSGlobalContextRelease(jsGlobalContext);
	currentRenderingContext->release();
	if(touchDelegate)touchDelegate->release();
	jsClasses->release();
	
	touches->release();
	timers->release();
	if(dataBundle)
		free(dataBundle);

	if(openGLContext != NULL) {
		openGLContext->release();
	}

	NSPoolManager::sharedPoolManager()->pop();
	NSPoolManager::purgePoolManager();
}

void EJApp::init(JNIEnv *env, jobject jobj, jobject assetManager, const char* path, int w, int h)
{
        env->GetJavaVM(&jvm);
        
        g_obj = jobj;

        // Set global pointer to Asset Manager in Java
        this->aassetManager = AAssetManager_fromJava(env, assetManager);
        
	if (dataBundle) {
		free(dataBundle);
	}

 	int len = (strlen(path) + 1);
	dataBundle = (char *)malloc(len * sizeof(char));
	memset(dataBundle, 0, len);

#ifdef _WINDOWS
	_snprintf(dataBundle, len, "%s", path);
#else
	snprintf(dataBundle, len, "%s", path);
#endif

	height = h;
	width = w;

	// Load the initial JavaScript source files
	// loadScriptAtPath(NSStringMake(EJECTA_BOOT_JS));
	// loadScriptAtPath(NSStringMake(EJECTA_MAIN_JS));
}


void EJApp::setScreenSize(int w, int h)
{
	height = h;
	width = w;
	if(screenRenderingContext) {
		screenRenderingContext->resizeToWidth(w, h);
		setCurrentRenderingContext((EJCanvasContext *)screenRenderingContext);
	}
}

void EJApp::run(void)
{

	if( paused ) { return; }

	EJHttpClient::getInstance()->dispatchResponseCallbacks(0);

	if (screenRenderingContext)
	{
	// Redraw the canvas
		//currentRenderingContext = (EJCanvasContext *)screenRenderingContext;
		setCurrentRenderingContext((EJCanvasContext *)screenRenderingContext);

	}

	if (!lockTouches)
	{
		lockTouches = true;
		if (touchDelegate&&touches&&touches->count()>0)
		{
			EJTouchEvent* event = (EJTouchEvent*)touches->objectAtIndex(0);
			NSLOG("event count %d %s(%d, %d)", touches->count(), event->eventName->getCString(), event->posX, event->posY);
			touchDelegate->triggerEvent(event->eventName, event->posX, event->posY, event->touchId);
			touches->removeObjectAtIndex(0);
		}
		lockTouches = false;
	}

	// Check all timers
	timers->update();
	
	if(screenRenderingContext) {
		if(drawDelegate != NULL)
		{
			invokeCallback(drawDelegate, NULL, 0, NULL);
		}
		screenRenderingContext->present();
		NSPoolManager::sharedPoolManager()->pop();
	}
}

void EJApp::pause(void)
{
	screenRenderingContext->finish();
	paused = true;
}

void EJApp::resume(void)
{
	paused = false;
}

void EJApp::clearCaches(void)
{
	JSGarbageCollect(jsGlobalContext);
}

void EJApp::hideLoadingScreen(void)
{
	//[loadingScreen removeFromSuperview];
	//[loadingScreen release];
	//loadingScreen = nil;
}

bool EJApp::doesFileExist(const char *filename) {
    struct stat st;
    return (stat(filename, &st)) == 0;
}

NSString *EJApp::pathForResource(NSString *resourcePath) {
    // Path to cache
    string full_path = string(dataBundle) + string("/") + string("cache/") + resourcePath->getCString();

    // Check if there is a file at this path
    bool isFileInCache = doesFileExist(full_path.c_str());

    if (isFileInCache) {
        return NSStringMake(full_path);
    }

    full_path = string(EJECTA_APP_FOLDER) + resourcePath->getCString();
    return NSStringMake(full_path);
}

// ---------------------------------------------------------------------------------
// Script loading and execution
void EJApp::loadJavaScriptFile(const char *filename) {
        // char to NSString
        string filenameString = string(filename);
        NSString *convertedFilename = NSStringMake(filenameString);
        loadScriptAtPath(convertedFilename);
}

void EJApp::loadScriptAtPath(NSString *path) {
    // Check file from cache - /data/data/
    NSString *scriptPath = pathForResource(path);
    NSString *script = NSString::createWithContentsOfFile(scriptPath->getCString());

    if (!script) {
        // Check file from main bundle - /assets/EJECTA_APP_FOLDER/
        if (this->aassetManager == NULL) {
            NSLOG("error loading asset manager");
            return;
        }
        
        const char *filename = scriptPath->getCString(); // "dirname/filename.ext";

        // Open file
        AAsset *asset = AAssetManager_open(this->aassetManager, filename, AASSET_MODE_UNKNOWN);
        if (NULL == asset) {
            NSLOG("Error: Cannot find script %s", path->getCString());
            return;
        } else {
           long size = AAsset_getLength(asset);
           unsigned char *buffer = (unsigned char *) malloc(sizeof(char) *size);
           int result = AAsset_read(asset, buffer, size);
           if (result < 0) {
               NSLOG("Error reading file %s", filename);
               AAsset_close(asset);
               free(buffer);
               return;
           }
           script = NSString::createWithData(buffer, size);
           AAsset_close(asset);
           free(buffer);
        }
    }

    JSStringRef scriptJS = JSStringCreateWithUTF8CString(script->getCString());
    JSStringRef pathJS = JSStringCreateWithUTF8CString(path->getCString());

    JSValueRef exception = NULL;
    JSEvaluateScript(jsGlobalContext, scriptJS, NULL, pathJS, 0, &exception );
    logException(exception, jsGlobalContext);

    JSStringRelease(scriptJS);
    JSStringRelease(pathJS);

}

JSValueRef EJApp::loadModuleWithId(NSString *moduleId, JSValueRef module, JSValueRef exports) {
	NSString *moduleIdFile = NSStringMake(moduleId->getCString() + string(".js"));
	NSString *scriptPath = pathForResource(moduleIdFile);
	NSString *script = NSString::createWithContentsOfFile(scriptPath->getCString());

	if (!script) {
            // Check file from main bundle - /assets/EJECTA_APP_FOLDER/
            if (this->aassetManager == NULL) {
                NSLOG("error loading asset manger");
                return NULL;
            }

            const char *filename = scriptPath->getCString(); // "dirname/filename.ext";

            // Open file
            AAsset *asset = AAssetManager_open(this->aassetManager, filename, AASSET_MODE_UNKNOWN);
            if (NULL == asset) {
                NSLOG("Error: Cannot find script %s", moduleIdFile->getCString());
                return NULL;
            } else {
                long size = AAsset_getLength(asset);
                unsigned char *buffer = (unsigned char *) malloc(sizeof(char) *size);
                int result = AAsset_read(asset, buffer, size);
                if (result < 0) {
                    NSLOG("Error reading file %s", moduleIdFile->getCString());
                    AAsset_close(asset);
                    free(buffer);
                    return NULL;
                }
                script = NSString::createWithData(buffer, size);
                AAsset_close(asset);
                free(buffer);
            }
        }
	
	NSLOG("Loading Module: %s", moduleId->getCString() );
	
	JSStringRef scriptJS = JSStringCreateWithUTF8CString(script->getCString());
	JSStringRef pathJS = JSStringCreateWithUTF8CString(moduleIdFile->getCString());
	JSStringRef parameterNames[] = {
		JSStringCreateWithUTF8CString("module"),
		JSStringCreateWithUTF8CString("exports"),
	};
	
	JSValueRef exception = NULL;
	JSObjectRef func = JSObjectMakeFunction( jsGlobalContext, NULL, 2,  parameterNames, scriptJS, pathJS, 0, &exception );
	
	JSStringRelease( scriptJS );
	JSStringRelease( pathJS );
	JSStringRelease(parameterNames[0]);
	JSStringRelease(parameterNames[1]);
	
	if( exception ) {
		logException(exception, jsGlobalContext);
		return NULL;
	}
	
	JSValueRef params[] = { module, exports };
	return invokeCallback(func, NULL, 2, params);
}

JSValueRef EJApp::invokeCallback(JSObjectRef callback, JSObjectRef thisObject, size_t argc, const JSValueRef argv[])
{
	JSValueRef exception = NULL;
	JSValueRef result = JSObjectCallAsFunction( jsGlobalContext, callback, thisObject, argc, argv, &exception );
	logException(exception,jsGlobalContext);
	return result;
}

//classId is EJBindingBase* or child class
JSClassRef EJApp::getJSClassForClass(EJBindingBase* classId)
{
	JSClassRef jsClass = NULL;

	if (jsClasses->count())
	{

		NSDictElement* pElement = NULL;
		NSObject* pObject = NULL;
		NSDICT_FOREACH(jsClasses, pElement)
		{
			string key = string(pElement->getStrKey());
	        if( key == classId->toString() ) {
				jsClass = (JSClassRef)((NSValue*)jsClasses->objectForKey(classId->toString()))->pointerValue();
				break;
			}	
		}
	}
	// Not already loaded? Ask the objc class for the JSClassRef!
	if( !jsClass ) {
		jsClass = classId->getJSClass(classId);
		jsClasses->setObject(new NSValue(jsClass, kJSClassRef), classId->toString());
	}
	return jsClass;
}

void EJApp::logException(JSValueRef valueAsexception, JSContextRef ctxp)
{
	if( !valueAsexception ) return;
	
	JSStringRef jsLinePropertyName = JSStringCreateWithUTF8CString("line");
	JSStringRef jsFilePropertyName = JSStringCreateWithUTF8CString("sourceURL");
	
	JSObjectRef exObject = JSValueToObject( ctxp, valueAsexception, NULL );
	JSValueRef valueAsline = JSObjectGetProperty( ctxp, exObject, jsLinePropertyName, NULL );
	JSValueRef valueAsfile = JSObjectGetProperty( ctxp, exObject, jsFilePropertyName, NULL );
	

    JSStringRef jsexception = JSValueToStringCopy(ctxp, valueAsexception, NULL);
    JSStringRef jsline = JSValueToStringCopy(ctxp, valueAsline, NULL);
    JSStringRef jsfile = JSValueToStringCopy(ctxp, valueAsfile, NULL);

    size_t jsexceptionSize = JSStringGetMaximumUTF8CStringSize(jsexception);
    char* exception = (char*)malloc(jsexceptionSize);
    JSStringGetUTF8CString(jsexception, exception, jsexceptionSize);

    size_t jslineSize = JSStringGetMaximumUTF8CStringSize(jsline);
    char* line = (char*)malloc(jslineSize);
    JSStringGetUTF8CString(jsline, line, jslineSize);

    size_t jsfileSize = JSStringGetMaximumUTF8CStringSize(jsfile);
    char* file = (char*)malloc(jsfileSize);
    JSStringGetUTF8CString(jsfile, file, jsfileSize);

	NSLOG("%s at line %s in %s", exception, line, file);
	

    free(exception);
    free(line);
    free(file);
    JSStringRelease(jsexception);
    JSStringRelease(jsline);
    JSStringRelease(jsfile);

	JSStringRelease( jsLinePropertyName );
	JSStringRelease( jsFilePropertyName );
}


// ---------------------------------------------------------------------------------
// Touch handlers


void EJApp::touchesBegan(int x, int y, int id)
{
	if (!lockTouches)
	{
		lockTouches = true;
		EJTouchEvent* event = new EJTouchEvent("touchstart", x, y, id);
		touches->addObject(event);
		event->release();
		lockTouches = false;
	}
}

void EJApp::touchesEnded(int x, int y, int id)
{
	if (!lockTouches)
	{
		lockTouches = true;
		EJTouchEvent* event = new EJTouchEvent("touchend", x, y, id);
		touches->addObject(event);
		event->release();
		lockTouches = false;
	}
}

void EJApp::touchesCancelled(int x, int y, int id)
{
	if (!lockTouches)
	{
		lockTouches = true;
		touchesEnded(x, y, id);
		lockTouches = false;
	}
}

void EJApp::touchesMoved(int x, int y, int id)
{
	if (!lockTouches)
	{
		lockTouches = true;
		EJTouchEvent* event = new EJTouchEvent("touchmove", x, y, id);
		touches->addObject(event);
		event->release();
		lockTouches = false;
	}
}


// ---------------------------------------------------------------------------------
// Timers


JSValueRef EJApp::createTimer(JSContextRef ctxp, size_t argc, const JSValueRef argv[],  BOOL repeat)
{
	if( argc != 2 || !JSValueIsObject(ctxp, argv[0]) || !JSValueIsNumber(jsGlobalContext, argv[1]) ) {
		return NULL;
	}
	
	JSObjectRef func = JSValueToObject(ctxp, argv[0], NULL);
	float interval = (float)JSValueToNumber(ctxp, argv[1], NULL) * 1000.0f;
	
	// Make sure short intervals (< 18ms) run each frame
	if( interval < 0.018 ) {
		interval = 0;
	}
	
	int timerId = timers->scheduleCallback(func, interval, repeat);
	return JSValueMakeNumber( ctxp, timerId );
}

JSValueRef EJApp::deleteTimer(JSContextRef ctxp, size_t argc, const JSValueRef argv[])
{
	if( argc != 1 || !JSValueIsNumber(ctxp, argv[0]) ) return NULL;
	
	timers->cancelId((int)JSValueToNumber(ctxp, argv[0], NULL));
	return NULL;
}

void EJApp::setCurrentRenderingContext(EJCanvasContext * renderingContext)
{
	if( renderingContext != currentRenderingContext ) {
		if(currentRenderingContext) {
			currentRenderingContext->flushBuffers();
			currentRenderingContext->release();
		}
		if(renderingContext){
			renderingContext->prepare();
			renderingContext->retain();
		}
		currentRenderingContext = renderingContext;
	}
}

EJApp* EJApp::instance()
{
	if (ejectaInstance == NULL)
	{
		ejectaInstance = new EJApp();
	}
	return ejectaInstance;
}


void EJApp::finalize()
{
	if (ejectaInstance != NULL)
	{
		ejectaInstance->release();
		ejectaInstance = NULL;
	}
}

// Add a javascript function that will be called when Renderer::onDrawFrame is called and prior to the rendering context present being called
void EJApp::setDrawDelegate(JSContextRef ctxp, size_t argc, const JSValueRef argv[])
{
	if( argc != 1 || !JSValueIsObject(ctxp, argv[0]) ) {
		return;
	}

	drawDelegate = JSValueToObject(ctxp, argv[0], NULL);

	return;
}

