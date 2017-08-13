class Critique{
	constructor(paragraphNumber, sentenceNumber, quote, analysis, errorType){
		this.paragraphIndex = paragraphNumber
		this.sentenceIndex = sentenceNumber
		this.quote = quote
		this.analysis = analysis
		this.errorType = errorType
	}
}
export default Critique;