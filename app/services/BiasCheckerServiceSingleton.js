export default class BiasCheckerServiceSingleton{
	constructor(instance){
		
	}
	if(BiasCheckerServiceSingleton._instance){
		return BiasCheckerServiceSingleton._instance
	}
	if(!(this instanceof BiasCheckerServiceSingleton)){
		return new BiasCheckerServiceSingleton(instance)
	}
	BiasCheckerServiceSingleton._instance = instance
}