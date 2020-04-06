import React, { Component } from 'react'
import {connect} from 'react-redux'
// import {selectMovie} from "../actions/index"
import {setTestContent,resetAttempts,setUserData} from '../actions/testActions'
import {bindActionCreators} from 'redux'
import axios from 'axios'
import Question from '../components/Question'
import Button from '@material-ui/core/Button';
import BarGraph from '../components/common/BarGraph'
import {questionAttemptStatus} from '../constants'
import LoginSignup from '../components/common/LoginSignup'
import '../../style/style.css'
class TestContainer extends Component{
    constructor(props){
        super(props)
        this.state={showResult:false,submitted:false,showLoginSignup:false,headerButtonText:"Login / Signup"}
    }  
    Handlers={
        setUser:(userData)=>{
            this.props.setUserData(userData)
            if(userData && Object.keys(userData).length){
                this.setState({showLoginSignup:false,headerButtonText:"Log-out"})
            }
        },
        handleLoginSignup:()=>{
            let headerButtonText
            if(!this.state.showLoginSignup){
                    headerButtonText="Show Test"
                }
            else{
                headerButtonText="Login / Signup"
            }
            if(this.state.headerButtonText==='Log-out'){
                this.props.setUserData(null)
                headerButtonText='Login / Signup'
                this.setState({headerButtonText})
            }
            else{
                this.setState({showLoginSignup:!this.state.showLoginSignup,headerButtonText})
        
            }
            },
        handleSubmit:()=>{
            this.setState({showResult:true,submitted:true})  
        },
        handleClearAll:()=>{
            console.log("handle clear all")
        },
        handleBackClick:()=>{
            this.setState({showResult:false})
        },
        clearValues:()=>{
            this.setState({submitted:false})
            this.props.resetAttempts()
        },
        submitResult:async ()=>{
            let userId = this.props && this.props.userData ?this.props.userData._id:'xyz'
            let submission = {}
            let {attempts,testContent} = this.props
            let total = testContent.questions ? testContent.questions.length:0
            let correct=0
            if(attempts){
             for (let key in attempts){
                 let attemptValue = attempts[key]
                 if(attemptValue && attemptValue['status']==='CORRECT'){
                     correct+=1
                 } 
             }
           }
           let perc = total? ((correct/total)*100).toFixed(2):0
           let result={}
           result['precent'] = perc
           result['attempts'] = attempts
           submission['creationTime'] = new Date().getTime();
           submission['testId']=testContent._id 
           submission['userId'] = userId
           submission['result']=result
           let params = {
               "submission":submission
           }
           let url = `http://localhost:4000/submitTest`
           try{
            let result = await axios.post(url,params)
            if(result.status===200){
                alert("Your test result is submitted");
            }
            else{
                alert("Something went wrong");
            }
             }
        catch(err){
            alert("Something went wrong");
        }

        }
    }
    
    fetchTest=async()=>{
        const testId = '5e89f09e9d5e75ef2136d74f'
        let server_url = `http://localhost:4000/getTest`
        let params = {
              testId:testId
           }        
        try{
            let result = await axios.get(server_url,{params})
            this.props.setTestContent(result && result.data?result.data:{})
        }
        catch(err){
            console.log("aaya error aaya",err)
        }
    } 


    DataHelpers={
        getResultData:()=>{
            let correct=0,incorrect=0
            let graphData = []
            if(this.props.attempts && Object.keys(this.props.attempts).length){
                //  let attemptedQuestions = Object.keys(this.props.attempts)
                 for(let qId in this.props.attempts){
                      let attemptObj = this.props.attempts[qId]
                      if(attemptObj.status===questionAttemptStatus.CORRECT){
                        correct+=1
                      }
                      else if (attemptObj.status===questionAttemptStatus.INCORRECT){
                       incorrect+=1
                      }
                 }
              let correctObj = {field:'Correct',value:correct,color:'#99ff99'}
              let incorrectObj = {field:'In-correct',value:incorrect,color:'#ff8566'}
              graphData.push(correctObj)
              graphData.push(incorrectObj)

            }
          return graphData
        },
    getQuestionStatus:(qId)=>{
        let status
        if(this.state.submitted && this.props.attempts){
            let attemptForQuestion = this.props.attempts[qId]
            if(attemptForQuestion){
                status=attemptForQuestion.status
            }
          }  
          return status
        }
     }
    
    Renderers={
        renderUserInfo:()=>{
        return(<div style={{paddingTop:"30px",paddingBottom:"30px"}}>
            <h2><bold>{`Welcome ${this.props.userData.userName}`}</bold></h2>
            <h4>try this test for performance evaluation.</h4>
            </div>)
        },
         
        renderLoginSignup:()=>{
            return(<div style={{width:"50%"}}><LoginSignup setUser={this.Handlers.setUser} /></div>)
        },

        renderQuestions:()=>{
           
            if(this.props.testContent){
            let questionElements = []  
            let questions = this.props.testContent.questions?this.props.testContent.questions:[]
            for(let question of questions){
                 questionElements.push(<Question testSubmitted={this.state.submitted} status={this.DataHelpers.getQuestionStatus(question.questionId)} question={question} />)
            }  
            return questionElements
              }
            },
           renderCTAs:()=>{
                 let ctaElements = []
                 ctaElements.push(<Button variant="contained" color="primary" onClick={this.Handlers.handleSubmit}>
                 {this.state.submitted ?'Go to result':'Submit'} 
               </Button>)
                ctaElements.push(<Button style={{marginLeft:"20px"}} variant="contained" color="secondary" onClick={this.Handlers.clearValues}>
                Clear Values
              </Button>)
             return(<div className="ctas-container">{ctaElements}</div>)
           },
           renderHeader:()=>{
                return(<div className="header-wrapper">
                    <div style={{padding:"20px",width:"30%"}}>
                 <Button variant="contained" color="primary" onClick={this.Handlers.handleLoginSignup}>
                 {this.state.headerButtonText}
                 </Button>
             </div>

                </div>)
           },
           renderResultSection:()=>{ 
            let resultElements = []
            let graphData = this.DataHelpers.getResultData()
            if(graphData.length){
                resultElements.push( <Button style={{marginTop:"30px"}} onClick={this.Handlers.handleBackClick} color="primary">{`<- Back to questions`}</Button>)
                resultElements.push(<div className="bar-graph-container"><BarGraph data={graphData}/></div>)
                resultElements.push(<Button variant="contained" color="primary" onClick={this.Handlers.submitResult}>Submit your result.</Button>)
                return (<div className="result-container">{resultElements}</div>)
             }
            }    
       }

    
    init(){
        // this.props.fetchTestContent()
        this.fetchTest()
    }
    componentDidMount(){
        this.init()
    } 
    render(){
        return(<React.Fragment>
            {/* {this.state.submitted && this.Renderers.renderHeader()} */}
            
            <div className="test-container">
        <div className="test-container-header">{this.Renderers.renderHeader()}</div>
        { this.state.showLoginSignup ? this.Renderers.renderLoginSignup()
        :<React.Fragment>
            <div>{this.props.userData && this.Renderers.renderUserInfo()}</div>
            <div>{this.Renderers.renderQuestions()}</div>
            <div>{this.Renderers.renderCTAs()}</div> 
            {this.state.showResult && this.Renderers.renderResultSection()}
            </React.Fragment>}
            
            </div>
         </React.Fragment>)
    }

}
function mapStateToProps(state){
   /*movies was assigned to state by our reducer reducer_movies*/
    return {testContent:state.testContent,attempts:state.attempts,userData:state.userData}
}

function mapDispatchToProps(dispatch){
   return bindActionCreators({setTestContent,resetAttempts,setUserData},dispatch)

}

/*this is called exporting the container.*/
/*a container is nothing but a component which is aware of redux state*/
export default connect(mapStateToProps,mapDispatchToProps)(TestContainer);

/*imp thing: whenever there is change in redux state, the containder will re-render*/