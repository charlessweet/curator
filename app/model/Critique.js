class Critique{
	constructor(paragraphNumber, sentenceNumber, quote, analysis, errorType, memberId, userName){
		this.paragraphIndex = paragraphNumber
		this.sentenceIndex = sentenceNumber
		this.quote = quote
		this.analysis = analysis
		this.errorType = errorType
		this.memberId = memberId
		this.userName = userName
	}
}
export default Critique;