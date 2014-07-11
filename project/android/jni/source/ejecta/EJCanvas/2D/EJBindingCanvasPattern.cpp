#include "EJBindingCanvasPattern.h"
#include <typeinfo>

EJBindingCanvasPattern::EJBindingCanvasPattern()
{
	pattern = NULL;
}

EJBindingCanvasPattern::EJBindingCanvasPattern(JSContextRef ctx, JSObjectRef obj, size_t argc, const JSValueRef argv[])
	:EJBindingBase(ctx, obj, argc ,argv)
{
	pattern = NULL;
}

EJBindingCanvasPattern::~EJBindingCanvasPattern()
{
	if(pattern!=NULL)
	{
		pattern->release();
	}
}

JSObjectRef EJBindingCanvasPattern::createJSObjectWithContext(JSContextRef ctx, EJCanvasPattern* pPattern)
{
	if(pPattern == NULL)
	{
		return NULL;
	}

	EJBindingCanvasPattern* binding = new EJBindingCanvasPattern(ctx, NULL, 0, NULL);
	pPattern->retain();
	binding->pattern = pPattern;
	JSObjectRef obj = EJBindingBase::createJSObjectWithContext(ctx, (EJBindingBase*)binding);

	return obj;
}

EJCanvasPattern* EJBindingCanvasPattern::patternFromJSValue(JSValueRef value)
{
	if( !value )
	{
		return NULL;
	}

	EJBindingCanvasPattern *binding = (EJBindingCanvasPattern *)JSObjectGetPrivate((JSObjectRef)value);

	if(binding && typeid(*binding) == typeid(EJBindingCanvasPattern))
	{
		return binding->pattern;
	}

	return NULL;
}

REFECTION_CLASS_IMPLEMENT(EJBindingCanvasPattern);

