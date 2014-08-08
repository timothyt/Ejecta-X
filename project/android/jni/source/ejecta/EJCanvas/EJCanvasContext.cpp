#ifdef _WINDOWS
#include <windows.h>
#include <tchar.h>
#include <GL/glew.h>
#include <GL/gl.h>
#include <GL/glext.h>
#else
#include <GLES2/gl2.h>
#include <GLES2/gl2ext.h>
#include <EGL/egl.h>
#endif
#include <typeinfo>
#include "../EJApp.h"
#include "EJCanvasContext.h"
#include "EJCanvasPattern.h"

PFNGLGENVERTEXARRAYSOESPROC EJCanvasContext::glGenVertexArrays;
PFNGLBINDVERTEXARRAYOESPROC EJCanvasContext::glBindVertexArray;
PFNGLDELETEVERTEXARRAYSOESPROC EJCanvasContext::glDeleteVertexArrays;
PFNGLISVERTEXARRAYOESPROC EJCanvasContext::glIsVertexArray;

EJCanvasContext::EJCanvasContext() :
	viewFrameBuffer(0),
	viewRenderBuffer(0),
	msaaFrameBuffer(0),
	msaaRenderBuffer(0),
	stencilBuffer(0),
	vertexBuffer(NULL),
	vertexBufferSize(0),
	vertexBufferIndex(0),
	upsideDown(false),
	currentProgram(NULL),
	sharedGLContext(NULL),
	fillObject(NULL)
{
}

//返回类名
const char* EJCanvasContext::getClassName() {
	return "EJCanvasContext";
}

EJCanvasContext::EJCanvasContext(short widthp, short heightp) :
	viewFrameBuffer(0),
	viewRenderBuffer(0),
	msaaFrameBuffer(0),
	msaaRenderBuffer(0),
	stencilBuffer(0),
	vertexBufferIndex(0),
	upsideDown(false),
	currentProgram(NULL)
{
	width = widthp;
	height = heightp;
	sharedGLContext = EJApp::instance()->getOpenGLContext();

	if(sharedGLContext != NULL) {
		vertexBuffer = sharedGLContext->getVertexBuffer();
		vertexBufferSize = EJ_OPENGL_VERTEX_BUFFER_SIZE;
	} else {
		vertexBuffer = NULL;
		vertexBufferSize = 0;
	}

	memset(stateStack, 0, sizeof(stateStack));
	stateIndex = 0;
	state = &stateStack[stateIndex];
	state->globalAlpha = 1;
	state->globalCompositeOperation = kEJCompositeOperationSourceOver;
	state->transform = CGAffineTransformIdentity;
	state->lineWidth = 1;
	state->lineCap = kEJLineCapButt;
	state->lineJoin = kEJLineJoinMiter;
	state->miterLimit = 10;
	state->textBaseline = kEJTextBaselineAlphabetic;
	state->textAlign = kEJTextAlignStart;
	//state->font = [[UIFont fontWithName:@"Helvetica" size:10] retain];
	state->font = new UIFont(NSStringMake("FuturaHv.ttf"),64);
	state->clipPath = NULL;
	
	bufferWidth = width = widthp;
	bufferHeight = height = heightp;

	path = new EJPath();
	backingStoreRatio = 1;
	
	fontCache = new NSCache();
	fontCache->setCountLimit(8);
	
	imageSmoothingEnabled = false;
	msaaEnabled = false;
	msaaSamples = 2;
	fillObject = NULL;
}

EJCanvasContext::~EJCanvasContext()
{
	fontCache->release();
	
	// Release all fonts and clip paths from the stack
	for( int i = 0; i < stateIndex + 1; i++ ) {
		stateStack[i].font->release();
		//stateStack[i].clipPath->release();
	}

#ifdef _WINDOWS
	if( viewFrameBuffer ) { glDeleteFramebuffers( 1, &viewFrameBuffer); }
	if( viewRenderBuffer ) { glDeleteRenderbuffers(1, &viewRenderBuffer); }
	if( msaaFrameBuffer ) {	glDeleteFramebuffers( 1, &msaaFrameBuffer); }
	if( msaaRenderBuffer ) { glDeleteRenderbuffers(1, &msaaRenderBuffer); }
	if( stencilBuffer ) { glDeleteRenderbuffers(1, &stencilBuffer); }
#else
	if( viewFrameBuffer ) { glDeleteFramebuffers( 1, &viewFrameBuffer); }
	if( viewRenderBuffer ) { glDeleteRenderbuffers(1, &viewRenderBuffer); }
	if( msaaFrameBuffer ) {	glDeleteFramebuffers( 1, &msaaFrameBuffer); }
	if( msaaRenderBuffer ) { glDeleteRenderbuffers(1, &msaaRenderBuffer); }
	if( stencilBuffer ) { glDeleteRenderbuffers(1, &stencilBuffer); }
#endif
	
	path->release();

	sharedGLContext = NULL;
	vertexBuffer = NULL;
}

void EJCanvasContext::create()
{
#ifdef _WINDOWS
	if( msaaEnabled ) {
		glGenFramebuffersEXT(1, &msaaFrameBuffer);
		glBindFramebufferEXT(GL_FRAMEBUFFER_EXT, msaaFrameBuffer);

		glGenRenderbuffersEXT(1, &msaaRenderBuffer);
		glBindRenderbufferEXT(GL_RENDERBUFFER_EXT, msaaRenderBuffer);

		//glRenderbufferStorageMultisampleIMG(GL_RENDERBUFFER, msaaSamples, GL_RGBA8, bufferWidth, bufferHeight);
		glFramebufferRenderbufferEXT(GL_FRAMEBUFFER_EXT, GL_COLOR_ATTACHMENT0, GL_RENDERBUFFER_EXT, msaaRenderBuffer);
	}

	glGenFramebuffersEXT(1, &viewFrameBuffer);
	glBindFramebufferEXT(GL_FRAMEBUFFER_EXT, viewFrameBuffer);

	glGenRenderbuffersEXT(1, &viewRenderBuffer);
	glBindRenderbufferEXT(GL_RENDERBUFFER_EXT, viewRenderBuffer);

#else
	if( msaaEnabled ) {
		glGenFramebuffers(1, &msaaFrameBuffer);
		glBindFramebuffer(GL_FRAMEBUFFER, msaaFrameBuffer);

		glGenRenderbuffers(1, &msaaRenderBuffer);
		glBindRenderbuffer(GL_RENDERBUFFER, msaaRenderBuffer);

		//glRenderbufferStorageMultisampleIMG(GL_RENDERBUFFER_OES, msaaSamples, GL_RGBA8_OES, bufferWidth, bufferHeight);
		glFramebufferRenderbuffer(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, GL_RENDERBUFFER, msaaRenderBuffer);
	}

	//Framebuffer and Renderbuffer are already generated by the Android view, they should not be generated for the onscreen canvas
	//Code specific to EJCanvasContextScreen and EJCanvasContextTexture but kept here in order to respect Ejecta iOS architecture
	if (strcmp(getClassName(),"EJCanvasContextTexture")==0) {
		glGenFramebuffers(1, &viewFrameBuffer);
		glBindFramebuffer(GL_FRAMEBUFFER, viewFrameBuffer);

		glGenRenderbuffers(1, &viewRenderBuffer);
		glBindRenderbuffer(GL_RENDERBUFFER, viewRenderBuffer);
	}
	else {
		viewFrameBuffer = (GLuint) 0;
		viewRenderBuffer = (GLuint) 0;
		
		glBindFramebuffer(GL_FRAMEBUFFER, viewFrameBuffer);
		glBindRenderbuffer(GL_RENDERBUFFER, viewRenderBuffer);
	}

	glDisable(GL_CULL_FACE);
	glDisable(GL_DITHER);

	glEnable(GL_BLEND);
	glDepthFunc(GL_ALWAYS);

	resizeToWidth(width, height);

#endif

}

void EJCanvasContext::resizeToWidth(short newWidth, short newHeight) {
	// This function is a stub - Overwritten in both subclasses
	width = newWidth;
	height = newHeight;
	
	// backingStoreRatio = (useRetinaResolution && [UIScreen mainScreen].scale == 2) ? 2 : 1;
	backingStoreRatio = 1;
	bufferWidth = width * backingStoreRatio;
	bufferHeight = height * backingStoreRatio;
	
	resetFramebuffer();
}

void EJCanvasContext::createBuffers()
{
    glGenBuffers(1, &rectVertexBufferId);
    glBindBuffer(GL_ARRAY_BUFFER, rectVertexBufferId);
    memset(&vertexData[0], 0, sizeof(EJVertex)*4);
    glBufferData(GL_ARRAY_BUFFER, sizeof(EJVertex)*4, &vertexData[0], GL_DYNAMIC_DRAW);
	glBindBuffer(GL_ARRAY_BUFFER, 0);

    //glGenBuffers(1, &rectIndexBufferId);
    //glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, rectIndexBufferId);
    indexData[0] = 0;
    indexData[1] = 2;
    indexData[2] = 1;
    indexData[3] = 1;
    indexData[4] = 2;
    indexData[5] = 3;
    //glBufferData(GL_ELEMENT_ARRAY_BUFFER, sizeof(GLushort)*4, indexData, GL_STATIC_DRAW);
}

void EJCanvasContext::resetFramebuffer()
{
	// Delete stencil buffer if present; it will be re-created when needed
	if( stencilBuffer ) {
		glDeleteRenderbuffers(1, &stencilBuffer);
		stencilBuffer = 0;
	}

	// Resize the MSAA buffer
	if( msaaEnabled && msaaFrameBuffer && msaaRenderBuffer ) {
		glBindFramebuffer(GL_FRAMEBUFFER, msaaFrameBuffer);
		glBindRenderbuffer(GL_RENDERBUFFER, msaaRenderBuffer);

		// TODO ttt glRenderbufferStorageMultisample(GL_RENDERBUFFER, msaaSamples, GL_RGBA8_OES, bufferWidth, bufferHeight);
		glFramebufferRenderbuffer(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, GL_RENDERBUFFER, msaaRenderBuffer);
	}

	prepare();

	// Clear to transparent
	glClearColor(0.0f, 0.0f, 0.0f, 0.0f);
	glClear(GL_COLOR_BUFFER_BIT);

	needsPresenting = true;
}

void EJCanvasContext::createStencilBufferOnce()
{
	if( stencilBuffer ) { return; }
#ifdef _WINDOWS

	glGenRenderbuffersEXT(1, &stencilBuffer);
	glBindRenderbufferEXT(GL_RENDERBUFFER_EXT, stencilBuffer);
	if( msaaEnabled ) {
		glRenderbufferStorageMultisample(GL_RENDERBUFFER_EXT, msaaSamples, GL_DEPTH24_STENCIL8, bufferWidth, bufferHeight);
	}
	else {
		glRenderbufferStorage(GL_RENDERBUFFER_EXT, GL_DEPTH24_STENCIL8, bufferWidth, bufferHeight);
	}
	glFramebufferRenderbufferEXT(GL_FRAMEBUFFER_EXT, GL_DEPTH_ATTACHMENT, GL_RENDERBUFFER_EXT, stencilBuffer);
	glFramebufferRenderbufferEXT(GL_FRAMEBUFFER_EXT, GL_STENCIL_ATTACHMENT, GL_RENDERBUFFER_EXT, stencilBuffer);

	glBindRenderbufferEXT(GL_RENDERBUFFER_EXT, msaaEnabled ? msaaRenderBuffer : viewRenderBuffer );

#else

	glGenRenderbuffers(1, &stencilBuffer);
	glBindRenderbuffer(GL_RENDERBUFFER, stencilBuffer);
	if( msaaEnabled ) {
		//glRenderbufferStorageMultisampleAPPLE(GL_RENDERBUFFER, msaaSamples, GL_DEPTH24_STENCIL8_OES, bufferWidth, bufferHeight);
	}
	else {
		glRenderbufferStorage(GL_RENDERBUFFER, GL_DEPTH24_STENCIL8_OES, bufferWidth, bufferHeight);
	}
	glFramebufferRenderbuffer(GL_FRAMEBUFFER, GL_DEPTH_ATTACHMENT, GL_RENDERBUFFER, stencilBuffer);
	glFramebufferRenderbuffer(GL_FRAMEBUFFER, GL_STENCIL_ATTACHMENT, GL_RENDERBUFFER, stencilBuffer);

	glBindRenderbuffer(GL_RENDERBUFFER, msaaEnabled ? msaaRenderBuffer : viewRenderBuffer );

#endif

	glClear(GL_STENCIL_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
	glEnable(GL_DEPTH_TEST);
}

void EJCanvasContext::createStandardVAO()
{
	if(!glGenVertexArraysOES)
	{
		glGenVertexArrays = (PFNGLGENVERTEXARRAYSOESPROC)eglGetProcAddress ( "glGenVertexArraysOES" );
		glBindVertexArray = (PFNGLBINDVERTEXARRAYOESPROC)eglGetProcAddress ( "glBindVertexArrayOES" );
		glDeleteVertexArrays = (PFNGLDELETEVERTEXARRAYSOESPROC)eglGetProcAddress ( "glDeleteVertexArraysOES" );
		glIsVertexArray = (PFNGLISVERTEXARRAYOESPROC)eglGetProcAddress ( "glIsVertexArrayOES" );
	}

	NSLog("glGenVertexArraysOES %x glBindVertexArrayOES %x glDeleteVertexArraysOES %x glIsVertexArrayOES %x", glGenVertexArrays, glBindVertexArray, glDeleteVertexArrays, glIsVertexArray);

	glGenVertexArrays(1, &standardVAO);
	glBindVertexArray(standardVAO);
	glEnableVertexAttribArray(kEJGLProgram2DAttributePos);
	glVertexAttribPointer(kEJGLProgram2DAttributePos, 2, GL_FLOAT, GL_FALSE, sizeof(EJVertex), (char *)vertexBuffer + offsetof(EJVertex, pos));

	glEnableVertexAttribArray(kEJGLProgram2DAttributeUV);
	glVertexAttribPointer(kEJGLProgram2DAttributeUV, 2, GL_FLOAT, GL_FALSE, sizeof(EJVertex), (char *)vertexBuffer + offsetof(EJVertex, uv));

	glEnableVertexAttribArray(kEJGLProgram2DAttributeColor);
	glVertexAttribPointer(kEJGLProgram2DAttributeColor, 4, GL_UNSIGNED_BYTE, GL_TRUE, sizeof(EJVertex), (char *)vertexBuffer + offsetof(EJVertex, color));

	glBindBuffer(GL_ARRAY_BUFFER,0);
	glBindVertexArray(0);
}

void EJCanvasContext::bindVertexBuffer()
{
	glEnableVertexAttribArray(kEJGLProgram2DAttributePos);
	glVertexAttribPointer(kEJGLProgram2DAttributePos, 2, GL_FLOAT, GL_FALSE, sizeof(EJVertex), (char *)vertexBuffer + offsetof(EJVertex, pos));
	
	glEnableVertexAttribArray(kEJGLProgram2DAttributeUV);
	glVertexAttribPointer(kEJGLProgram2DAttributeUV, 2, GL_FLOAT, GL_FALSE, sizeof(EJVertex), (char *)vertexBuffer + offsetof(EJVertex, uv));

	glEnableVertexAttribArray(kEJGLProgram2DAttributeColor);
	glVertexAttribPointer(kEJGLProgram2DAttributeColor, 4, GL_UNSIGNED_BYTE, GL_TRUE, sizeof(EJVertex), (char *)vertexBuffer + offsetof(EJVertex, color));

	/*
	glBindBuffer(GL_ARRAY_BUFFER, rectVertexBufferId);
	glVertexAttribPointer(kEJGLProgram2DAttributePos, 2, GL_FLOAT, GL_FALSE, sizeof(EJVertex), (void*)offsetof(EJVertex, pos));
	glEnableVertexAttribArray(kEJGLProgram2DAttributePos);

	glEnableVertexAttribArray(kEJGLProgram2DAttributeUV);
	glVertexAttribPointer(kEJGLProgram2DAttributeUV, 2, GL_FLOAT, GL_FALSE, sizeof(EJVertex), (void*)offsetof(EJVertex, uv));

	glEnableVertexAttribArray(kEJGLProgram2DAttributeColor);
	glVertexAttribPointer(kEJGLProgram2DAttributeColor, 4, GL_UNSIGNED_BYTE, GL_TRUE, sizeof(EJVertex), (void*)offsetof(EJVertex, color));
	*/
	//glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, indexBuffer);
}

void EJCanvasContext::prepare()
{
	//Bind the frameBuffer and vertexBuffer array
#ifdef _WINDOWS
	glBindFramebufferEXT(GL_FRAMEBUFFER_EXT, msaaEnabled ? msaaFrameBuffer : viewFrameBuffer );
	glBindRenderbufferEXT(GL_RENDERBUFFER_EXT, msaaEnabled ? msaaRenderBuffer : viewRenderBuffer );
#else
	glBindFramebuffer(GL_FRAMEBUFFER, msaaEnabled ? msaaFrameBuffer : viewFrameBuffer );
	glBindRenderbuffer(GL_RENDERBUFFER, msaaEnabled ? msaaRenderBuffer : viewRenderBuffer );
#endif	
	glViewport(0, 0, bufferWidth, bufferHeight);
	
	EJCompositeOperation op = state->globalCompositeOperation;
	glBlendFunc( EJCompositeOperationFuncs[op].source, EJCompositeOperationFuncs[op].destination );
	currentTexture = NULL;
	currentProgram = NULL;
	EJTexture::setSmoothScaling(imageSmoothingEnabled);
	
	if( stencilBuffer ) {
		glEnable(GL_DEPTH_TEST);
	}
	else {
		glDisable(GL_DEPTH_TEST);
	}

	if( state->clipPath ) {
		glDepthFunc(GL_EQUAL);
	}
	else {
		glDepthFunc(GL_ALWAYS);
	}

	bindVertexBuffer();
    indexData[0] = 0;
    indexData[1] = 2;
    indexData[2] = 1;
    indexData[3] = 1;
    indexData[4] = 2;
    indexData[5] = 3;
	needsPresenting = true;
}


void EJCanvasContext::setWidth(short newWidth) {
	if( newWidth == width ) {

		// Same width as before? Just clear the canvas, as per the spec
		flushBuffers();
		glClear(GL_COLOR_BUFFER_BIT);
		return;
	}
	resizeToWidth(newWidth, height);
}

short EJCanvasContext::getWidth() const {
	return width;
}

void EJCanvasContext::setHeight(short newHeight) {
	if( newHeight == height ) {
		// Same height as before? Just clear the canvas, as per the spec
		flushBuffers();
		glClear(GL_COLOR_BUFFER_BIT);
		return;
	}
	resizeToWidth(width, newHeight);
}

short EJCanvasContext::getHeight() const {
	return height;
}

void EJCanvasContext::setTexture(EJTexture * newTexture) {
	if( currentTexture == newTexture ) { return; }
	
	flushBuffers();
	
	currentTexture = newTexture;
	if(currentTexture)currentTexture->bind();
}

void EJCanvasContext::setProgram(EJGLProgram2D *newProgram) {
    if( currentProgram == newProgram ) { return; }
    

    flushBuffers();
    currentProgram = newProgram;
    
	if(currentProgram == NULL)
	{
		return;
	}
	    
    glUseProgram(currentProgram->getProgram());
    glUniform2f(currentProgram->getScreen(), width, height * (upsideDown ? -1 : 1));
}

void EJCanvasContext::pushTri(float x1, float y1, float x2, float y2, float x3, float y3, EJColorRGBA color, CGAffineTransform transform)
{
	EJVector2 d1 = { x1, y1 };
	EJVector2 d2 = { x2, y2 };
	EJVector2 d3 = { x3, y3 };
	
	if( !CGAffineTransformIsIdentity(transform) ) {
		d1 = EJVector2ApplyTransform( d1, transform );
		d2 = EJVector2ApplyTransform( d2, transform );
		d3 = EJVector2ApplyTransform( d3, transform );
	}
	
	EJVertex * vb = &vertexBuffer[vertexBufferIndex];

	EJVertex vb_0 = {d1, {0.5, 1}, color};
	EJVertex vb_1 = { d2, {0.5, 0.5}, color };
	EJVertex vb_2 = { d3, {0.5, 1}, color };

	vb[0] = vb_0;
	vb[1] = vb_1;
	vb[2] = vb_2;
	
	vertexBufferIndex += 3;

	DrawTriangles();
}

void EJCanvasContext::pushQuad(EJVector2 v1, EJVector2 v2, EJVector2 v3, EJVector2 v4, EJVector2 t1, EJVector2 t2, EJVector2 t3, EJVector2 t4, EJColorRGBA color, CGAffineTransform transform)
{
	// TODO disable quad for now ttt
	if( !CGAffineTransformIsIdentity(transform) ) {
		v1 = EJVector2ApplyTransform( v1, transform );
		v2 = EJVector2ApplyTransform( v2, transform );
		v3 = EJVector2ApplyTransform( v3, transform );
		v4 = EJVector2ApplyTransform( v4, transform );
	}
	
	EJVertex * vb = &vertexBuffer[vertexBufferIndex];

	EJVertex vb_0 = { v1, t1, color };
	EJVertex vb_1 = { v2, t2, color };
	EJVertex vb_2 = { v3, t3, color };
	EJVertex vb_3 = { v2, t2, color };
	EJVertex vb_4 = { v3, t3, color };
	EJVertex vb_5 = { v4, t4, color };

	/*
	vb[0] = vb_0;
	vb[1] = vb_1;
	vb[2] = vb_2;
	vb[3] = vb_3;
	vb[4] = vb_4;
	vb[5] = vb_5;
	
	vertexBufferIndex += 6;
	*/
	vb[0] = vb_0;
	vb[1] = vb_2;
	vb[2] = vb_1;
	vb[3] = vb_5;
	vertexBufferIndex += 4;

	DrawTriangles();
}

void EJCanvasContext::pushRect(float x, float y, float w, float h, float tx, float ty, float tw, float th, EJColorRGBA color, CGAffineTransform transform)
{
	EJVector2 d11 = { x, y };   // v0
	EJVector2 d21 = { x+w, y }; // v1
	EJVector2 d12 = { x, y+h }; // v2
	EJVector2 d22 = { x+w, y+h }; // v3
	
	if( !CGAffineTransformIsIdentity(transform) ) {
		d11 = EJVector2ApplyTransform( d11, transform );
		d21 = EJVector2ApplyTransform( d21, transform );
		d12 = EJVector2ApplyTransform( d12, transform );
		d22 = EJVector2ApplyTransform( d22, transform );
	}
	
	EJVertex * vb = &vertexBuffer[vertexBufferIndex];

	EJVertex vb_0 = { d11, {0, 0}, color };	// top left
	EJVertex vb_1 = { d21, {0, 0}, color };	// top right
	EJVertex vb_2 = { d12, {0, 0}, color };	// bottom left

	EJVertex vb_3 = { d21, {0, 0}, color };	// top right
	EJVertex vb_4 = { d12, {0, 0}, color };	// bottom left
	EJVertex vb_5 = { d22, {0, 0}, color };// bottom right

	/*
	vb[0] = vb_0;	// top left
	vb[1] = vb_1;	// top right
	vb[2] = vb_2;	// bottom left
		
	vb[3] = vb_3;	// top right
	vb[4] = vb_4;	// bottom left
	vb[5] = vb_5;// bottom right
	
	vertexBufferIndex += 6;
	*/
	vb[0] = vb_2;	// top left
	vb[1] = vb_0;   // bottom left
	vb[2] = vb_5;   // top right
	vb[3] = vb_1;   // bottom right

	vertexBufferIndex += 4;

	DrawTriangles();
}

void EJCanvasContext::pushFilledRect(float x, float y, float w, float h, EJFillable* fillable, EJColorRGBA color, CGAffineTransform transform)
{
	if(typeid(*fillable) == typeid(EJCanvasPattern))
	{
		EJCanvasPattern *pattern = (EJCanvasPattern *)fillable;
		pushPatternedRect(x, y, w, h, pattern, color, transform);
	}
	else
	{
		NSLOG("Unsupported EJFillable type (%s)", typeid(fillable).name());
	}
	/*

	if( [fillable isKindOfClass:[EJCanvasPattern class]] ) {
		EJCanvasPattern *pattern = (EJCanvasPattern *)fillable;
		[self pushPatternedRectX:x y:y w:w h:h pattern:pattern color:color withTransform:transform];
	}
	else if( [fillable isKindOfClass:[EJCanvasGradient class]] ) {
		EJCanvasGradient *gradient = (EJCanvasGradient *)fillable;
		[self pushGradientRectX:x y:y w:w h:h gradient:gradient color:color withTransform:transform];
	}
}
*/
}

void EJCanvasContext::pushPatternedRect(float x, float y, float w, float h, EJCanvasPattern* pattern, EJColorRGBA color, CGAffineTransform transform)
{
	EJTexture *texture = pattern->GetTexture();
	float scale = texture->contentScale;
	float tw = texture->width / scale;
	float th = texture->height / scale;
	float pw = w;
	float ph = h;

	if( !(pattern->GetRepeat() & kEJCanvasPatternRepeatX) )
	{
		pw = MIN(tw - x, w);
	}

	if( !(pattern->GetRepeat() & kEJCanvasPatternRepeatY) )
	{
		ph = MIN(th - y, h);
	}

	if( pw > 0 && ph > 0 )
	{
		setProgram(sharedGLContext->getGlProgram2DPattern());
		setTexture(texture);
		pushTexturedRect(x, y, pw, ph, x/tw, y/th, pw/tw, ph/th, color, transform);
	}

	if( pw < w || ph < h )
	{
		// Draw clearing rect for the stencil buffer if we didn't fill everything with
		// the pattern image - happens when not repeating in both directions
		setProgram(sharedGLContext->getGlProgram2DFlat());
		static EJColorRGBA transparentBlack = {0x0};
		pushRect(x, y, w, h, 0, 0, 0, 0, transparentBlack, state->transform);
	}
}

void EJCanvasContext::pushTexturedRect(float x, float y, float w, float h, float tx, float ty, float tw, float th, EJColorRGBA color, CGAffineTransform transform)
{
	EJVector2 d11 = { x, y };     // bottom left
	EJVector2 d21 = { x+w, y };   // bottom right
	EJVector2 d12 = { x, y+h };   // top left
	EJVector2 d22 = { x+w, y+h };  // top right
	
	if( !CGAffineTransformIsIdentity(transform) ) {
		d11 = EJVector2ApplyTransform( d11, transform );
		d21 = EJVector2ApplyTransform( d21, transform );
		d12 = EJVector2ApplyTransform( d12, transform );
		d22 = EJVector2ApplyTransform( d22, transform );
	}
	
	EJVertex * vb = &vertexBuffer[vertexBufferIndex];

	EJVertex vb_0 = { d11, {tx, ty}, color };	// top left             bottom left
	EJVertex vb_1 = { d21, {tx+tw, ty}, color };	// top right        bottom right
	EJVertex vb_2 = { d12, {tx, ty+th}, color };	// bottom left      top left

	EJVertex vb_3 = { d21, {tx+tw, ty}, color };	// top right        bottom right
	EJVertex vb_4 = { d12, {tx, ty+th}, color };	// bottom left      top left
	EJVertex vb_5 = { d22, {tx+tw, ty+th}, color };// bottom right      top right

	/*
	vb[0] = vb_0;	// top left
	vb[1] = vb_1;	// top right
	vb[2] = vb_2;	// bottom left
		
	vb[3] = vb_3;	// top right
	vb[4] = vb_4;	// bottom left
	vb[5] = vb_5;// bottom right
	
	vertexBufferIndex += 6;
	*/

	vb[0] = vb_2;	// top left
	vb[1] = vb_0;   // bottom left
	vb[2] = vb_5;   // top right
	vb[3] = vb_1;   // bottom right

	vertexBufferIndex += 4;
	DrawTriangles();
}

void EJCanvasContext::flushBuffers()
{
	return;

	if( vertexBufferIndex == 0 ) { return; }

	glDrawArrays(GL_TRIANGLES, 0, vertexBufferIndex);
	needsPresenting = true;
	vertexBufferIndex = 0;
}

void EJCanvasContext::DrawTriangles()
{
	if( vertexBufferIndex == 0 ) { return; }

	// copy new data to vertex buffer
	//glBufferSubData(GL_ARRAY_BUFFER, 0, sizeof(vertexData)*4, vertexData);
	//glBufferData(GL_ARRAY_BUFFER, sizeof(vertexData), vertexData, GL_DYNAMIC_DRAW);
	//glDrawElements(GL_TRIANGLE_STRIP, 4, GL_UNSIGNED_SHORT, 0);
	//glDrawArrays(GL_TRIANGLE_STRIP, 0, vertexBufferIndex);

	// Drawing individual triangles seems to be more performant for small groups of triangles than tristrips. Future work to bundle tris should be investigated
	glDrawElements(GL_TRIANGLES, 6, GL_UNSIGNED_SHORT, indexData);

	needsPresenting = true;
	vertexBufferIndex = 0;
}

void EJCanvasContext::setGlobalCompositeOperation(EJCompositeOperation op) {
	// Same composite operation or switching between SourceOver <> Lighter? We don't
	// have to flush and set the blend mode then, but we still need to update the state,
	// as the alphaFactor may be different.
	if (
		op == state->globalCompositeOperation ||
		(op == kEJCompositeOperationLighter && state->globalCompositeOperation == kEJCompositeOperationSourceOver) ||
		(op == kEJCompositeOperationSourceOver && state->globalCompositeOperation == kEJCompositeOperationLighter)
	) {
		state->globalCompositeOperation = op;
		return;
	}

	flushBuffers();
	glBlendFunc(EJCompositeOperationFuncs[op].source, EJCompositeOperationFuncs[op].destination);
	state->globalCompositeOperation = op;
}

EJCompositeOperation EJCanvasContext::getGlobalCompositeOperation() const {
	return state->globalCompositeOperation;
}

void EJCanvasContext::save()
{
	if( stateIndex == EJ_CANVAS_STATE_STACK_SIZE-1 ) {
		//NSLOG("Warning: EJ_CANVAS_STATE_STACK_SIZE (%d) reached", EJ_CANVAS_STATE_STACK_SIZE);
		return;
	}
	
	stateStack[stateIndex+1] = stateStack[stateIndex];
	stateIndex++;
	state = &stateStack[stateIndex];
	state->font->retain();
	if(state->clipPath)state->clipPath->retain();
}

void EJCanvasContext::restore()
{
	if( stateIndex == 0 ) {
		NSLOG("Warning: Can't pop stack at index 0");
		return;
	}
	
	EJCompositeOperation oldCompositeOp = state->globalCompositeOperation;
	EJPath * oldClipPath = state->clipPath;
	
	// Clean up current state
	state->font->release();

	if( state->clipPath && state->clipPath != stateStack[stateIndex-1].clipPath ) {
		resetClip();
	}
	if( state->clipPath )state->clipPath->release();
	
	// Load state from stack
	stateIndex--;
	state = &stateStack[stateIndex];
	
    path->transform = state->transform;
    
	// Set Composite op, if different
	if( state->globalCompositeOperation != oldCompositeOp ) {
		setGlobalCompositeOperation(state->globalCompositeOperation);
	}
	
	// Render clip path, if present and different
	if( state->clipPath && state->clipPath != oldClipPath ) {
		setProgram(sharedGLContext->getGlProgram2DFlat());
		state->clipPath->drawPolygonsToContext(this,kEJPathPolygonTargetDepth);
	}
}

void EJCanvasContext::rotate(float angle)
{
	state->transform = CGAffineTransformRotate( state->transform, angle );
    path->transform = state->transform;
}

void EJCanvasContext::translate(float x, float y)
{
	state->transform = CGAffineTransformTranslate( state->transform, x, y );
    path->transform = state->transform;
}

void EJCanvasContext::scale(float x, float y)
{
	state->transform = CGAffineTransformScale( state->transform, x, y );
	path->transform = state->transform;
}

void EJCanvasContext::transform(float m11, float m12, float m21, float m22, float dx, float dy)
{
	CGAffineTransform t = CGAffineTransformMake( m11, m12, m21, m22, dx, dy );
	state->transform = CGAffineTransformConcat( t, state->transform );
	path->transform = state->transform;
}

void EJCanvasContext::setTransform(float m11, float m12, float m21, float m22, float dx, float dy)
{
	state->transform = CGAffineTransformMake( m11, m12, m21, m22, dx, dy );
	path->transform = state->transform;
}

void EJCanvasContext::drawImage(EJTexture * texture, float sx, float sy, float sw, float sh, float dx, float dy, float dw, float dh)
{
	if (texture)
	{
		float tw = texture->realWidth;
		float th = texture->realHeight;

		//NSLog("drawImage sx %f sy %f sw %f sh %f dx %f dy %f dw %f dh %f", sx, sy, sw, sh, dx, dy, dw, dh);
		setProgram(sharedGLContext->getGlProgram2DTexture());
		setTexture(texture);
		pushTexturedRect(dx, dy, dw, dh, sx/tw, sy/th, sw/tw, sh/th, EJCanvasBlendWhiteColor(state), state->transform);
	}
	else
	{
		NSLog("!!!!EJCanvasContext::drawImage Drawing without texture!!!!");
	}
}

void EJCanvasContext::fillRect(float x, float y, float w, float h)
{
	if( state->fillObject )
	{
		pushFilledRect(x, y, w, h, state->fillObject, EJCanvasBlendWhiteColor(state), state->transform);
	}
	else
	{
		setProgram(sharedGLContext->getGlProgram2DFlat());
		EJColorRGBA cc = EJCanvasBlendFillColor(state);
		pushRect(x, y, w, h, 0, 0, 0, 0, cc, state->transform);
	}
}

void EJCanvasContext::strokeRect(float x, float y, float w, float h)
{
	// strokeRect should not affect the current path, so we create
	// a new, tempPath instead.
	EJPath * tempPath = new EJPath();
	tempPath->transform = state->transform;
	
	tempPath->moveTo(x, y);
	tempPath->lineTo(x+w, y);
	tempPath->lineTo(x+w, y+h);
	tempPath->lineTo(x, y+h);
	tempPath->close();
	
	setProgram(sharedGLContext->getGlProgram2DFlat());
	tempPath->drawLinesToContext(this);
	tempPath->release();

}

void EJCanvasContext::clearRect(float x, float y, float w, float h)
{
	setProgram(sharedGLContext->getGlProgram2DFlat());

	EJCompositeOperation oldOp = state->globalCompositeOperation;
	setGlobalCompositeOperation(kEJCompositeOperationDestinationOut);
	
	static EJColorRGBA white = {0xffffffff};
	pushRect(x, y, w, h, 0, 0, 0, 0, white, state->transform);
	
	setGlobalCompositeOperation(oldOp);
}

EJImageData* EJCanvasContext::getImageData(float sx, float sy, float sw, float sh)
{
	flushBuffers();
	GLubyte * pixels = (GLubyte*)malloc( (size_t)sw * (size_t)sh * 4 * sizeof(GLubyte));
	glReadPixels((GLint)sx, (GLint)sy, (GLsizei)sw, (GLsizei)sh, GL_RGBA, GL_UNSIGNED_BYTE, pixels);
	EJImageData* imageData = new EJImageData((int)sw, (int)sh, pixels);
	imageData->autorelease();
	return imageData;
}

void EJCanvasContext::putImageData(EJImageData* imageData, float dx, float dy)
{
	EJTexture * texture = imageData->texture();
	setProgram(sharedGLContext->getGlProgram2DTexture());
	setTexture(texture);
	
	short tw = texture->realWidth;
	short th = texture->realHeight;
	
	static EJColorRGBA white = {0xffffffff};
	
	pushTexturedRect(dx, dy, tw, th, 0, 0, 1, 1, white, CGAffineTransformIdentity);
	flushBuffers();
}

void EJCanvasContext::beginPath()
{
	path->reset();
}

void EJCanvasContext::closePath()
{
	path->close();
}

void EJCanvasContext::fill()
{
	setProgram(sharedGLContext->getGlProgram2DFlat());
	path->drawPolygonsToContext(this,  kEJPathPolygonTargetColor);
}

void EJCanvasContext::stroke()
{
	setProgram(sharedGLContext->getGlProgram2DFlat());
	path->drawLinesToContext(this);
}

void EJCanvasContext::moveTo(float x, float y)
{
	path->moveTo(x, y);
}

void EJCanvasContext::lineTo(float x, float y)
{
	path->lineTo(x, y);
}

void EJCanvasContext::bezierCurveTo(float cpx, float cpy, float cpx2, float cpy2, float x, float y)
{
	float scale = CGAffineTransformGetScale( state->transform );
	path->quadraticCurveTo(cpx, cpy, x, y, scale);
}

void EJCanvasContext::quadraticCurveTo(float cpx, float cpy, float x, float y)
{
	float scale = CGAffineTransformGetScale( state->transform );
	path->quadraticCurveTo(cpx, cpy, x, y, scale);
}

void EJCanvasContext::rect(float x, float y, float w, float h)
{
	path->moveTo(x, y);
	path->lineTo(x+w, y);
	path->lineTo(x+w, y+h);
	path->lineTo(x, y+h);
	path->close();
}

void EJCanvasContext::arcTo(float x1, float y1, float x2, float y2, float radius)
{
	path->arcTo(x1, y1, x2, y2, radius);
}

void EJCanvasContext::arc(float x, float y, float radius, float startAngle, float endAngle, BOOL antiClockwise)
{
	path->arc(x, y, radius, startAngle, endAngle, antiClockwise);
}

EJFont* EJCanvasContext::acquireFont(NSString* fontName , float pointSize ,BOOL fill ,float contentScale) {	
	//NSString * cacheKey = NSString::createWithFormat("%s_%.2f_%d_%.2f", fontName->getCString(), pointSize, fill, contentScale);
	EJFont * font = (EJFont *)fontCache->objectForKey(fontName->getCString());	
	if( !font ) {
		font =new EJFont(fontName,pointSize ,fill ,contentScale);		
		fontCache->setObject(font,fontName->getCString());
		font->release();
	}else{
		font->setFill(fill);
	}
	return font;
}

void EJCanvasContext::fillText(NSString * text, float x, float y)
{
	EJFont *font =acquireFont(state->font->fontName ,state->font->pointSize,true,backingStoreRatio);	

	setProgram(sharedGLContext->getGlProgram2DAlphaTexture());
	font->drawString(text, this, x, y);
}

void EJCanvasContext::strokeText(NSString * text, float x, float y)
{
	EJFont *font =acquireFont(state->font->fontName ,state->font->pointSize,false,backingStoreRatio);

	setProgram(sharedGLContext->getGlProgram2DAlphaTexture());
	font->drawString(text, this, x, y);	
	fillText(text,x,y);
}

float EJCanvasContext::measureText(NSString * text)
{
	EJFont *font =acquireFont(state->font->fontName ,state->font->pointSize,true,backingStoreRatio);
	return font->measureString(text);
}

void EJCanvasContext::clip()
{
	flushBuffers();

	if(state == NULL)
	{
		return;
	}
	else
	{
		if(state->clipPath == NULL)
		{
			//NSLOG("EJCanvasContext state->clipPath was null");
		}
	}
	
	if(state->clipPath)
	{
		state->clipPath->release();
		state->clipPath = NULL;
	}

	state->clipPath = (EJPath*)(path->copy());
	setProgram(sharedGLContext->getGlProgram2DFlat());
	state->clipPath->drawPolygonsToStencil(this);
	glStencilFunc(GL_EQUAL, 0x1, 0xFFFFFFFF);
	glStencilOp(GL_KEEP, GL_KEEP, GL_KEEP);
	glEnable(GL_STENCIL_TEST);
}

void EJCanvasContext::resetClip()
{
	if( state->clipPath ) {
		flushBuffers();
		state->clipPath->release();
		state->clipPath = NULL;
		glDisable(GL_STENCIL_TEST);

	}
}

void EJCanvasContext::setFillObject(EJFillable* pFillObject)
{
	if(state)
	{
		if(state->fillObject)
		{
			state->fillObject->release();
		}
		if(pFillObject)
		{
			pFillObject->retain();
		}
		state->fillObject = pFillObject;
	}
}

EJFillable* EJCanvasContext::getFillObject()
{
	return state->fillObject;
}
