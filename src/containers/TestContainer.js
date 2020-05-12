import React, { Component } from 'react'
import {connect} from 'react-redux'
// import {selectMovie} from "../actions/index"
import {setTestContent,resetAttempts,setUserData} from '../actions/testActions'
import {bindActionCreators} from 'redux'
import axios from 'axios'
import Question from '../components/Question'
import AdminPanel from '../components/AdminPanel'
import Button from '@material-ui/core/Button';
import BarGraph from '../components/common/BarGraph'
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import {questionAttemptStatus,ROLE_ADMIN} from '../constants'
import LoginSignup from '../components/common/LoginSignup'
import Typography from '@material-ui/core/Typography';
import Rating from '@material-ui/lab/Rating';
import '../../style/style.css'
const FEEDBACK_OBJECT_TYPE='test'
const FEEDBACK_SCALE=5

class TestContainer extends Component{
    constructor(props){
        super(props)
        this.state={showResult:false,resultType:null,submitted:false,showLoginSignup:true,headerButtonText:"Login / Signup",prevSubmissions:[],fetchedTests:[],selectedTest:null}
    }  
    Handlers={
        setTestRating:async(event, newValue) => {
            let selectedTestId = this.state.selectedTest._id
            let submittedFeedbacks = this.state.submittedFeedbacks
            submittedFeedbacks[selectedTestId] = newValue
            this.setState({submittedFeedbacks},async()=>{
               let url = `http://localhost:4000/submitFeedback_v2` 
               let params={}
               params['objectType']=FEEDBACK_OBJECT_TYPE
               params['objectId'] = this.state.selectedTest._id
               params['feedbackScale'] = FEEDBACK_SCALE
               params['feedbackValue'] = newValue
               params['userId'] = this.props.userData._id
               try{
                let result = await axios.post(url,params);
                if(result.status===200){
                    let submittedFeedbacks = this.state.submittedFeedbacks
                   let defaultFeedback = {feedbackScale: FEEDBACK_SCALE,
                                            feedbackValue: newValue,
                                            objectId:this.state.selectedTest._id,
                                            objectType: "test"
                                        }
                    
                    
                    submittedFeedbacks[selectedTestId] = defaultFeedback
                    this.setState({submittedFeedbacks})

                    alert("Your test feedback is submitted successfully");
                }
                else{
                    alert("Something went wrong");
                 }
                }
              catch(err){
                alert("Something went wrong");
             }
            })
        },
        handleTestListClick:()=>{
            this.setState({selectedTest:null})   
        }, 

        handleAttemptTest:(selectedTest)=>{
            this.setState({selectedTest},()=>{
                this.props.setTestContent(selectedTest)
            })
        },
        fetchAllSubmissions:async()=>{
            let url = `http://localhost:4000/getSubmissionsForUser`
            let params={userId:this.props && this.props.userData ?this.props.userData._id:'xyz'}
            try{
              let result = await axios.get(url,{params})
             if(result.status===200){
                this.setState({prevSubmissions:result && result.data?result.data:[]})
                // alert("Your test result is submitted");
             }
             else{
                 alert("Something went wrong while fetching all submissions");
             }
              }
         catch(err){
             alert("Something went wrong while fetching submissions");
         }
 


        },
        handlePreviousResultClick:()=>{
             this.Handlers.fetchAllSubmissions()

            this.setState({showResult:true,resultType:'all'})
        },
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
                // headerButtonText='Login / Signup'
                this.setState({headerButtonText,showLoginSignup:true})
            }
            else{
                this.setState({showLoginSignup:!this.state.showLoginSignup,headerButtonText})
        
            }
            },
        handleSubmit:()=>{
            this.setState({showResult:true,submitted:true,resultType:null})  
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
   componentDidUpdate(prevProps,prevState){
    if(!prevProps.userData && this.props.userData){
        this.fetchTests()
    }  
    
    if(prevProps.userData && this.props.userData && prevProps.userData.email!==this.props.userData.email){
        this.fetchTests()
      }

   }
    
    fetchTests=async()=>{
        if(this.props.userData && Object.keys(this.props.userData).length){
            const {target,grade} = this.props.userData
            if(target && grade){
                let server_url = `http://localhost:4000/getTest`
                let params = {
                      target,grade,userId:this.props.userData._id
                   }
                try{
                    let result = await axios.get(server_url,{params})
                    if(result && result.status===200){
                         if(result.data){
                             this.setState({fetchedTests:result.data},async()=>{
                                 let testIds = this.state.fetchedTests.map((ft)=>{
                                     return ft._id
                                 })
                                 let server_url = `http://localhost:4000/getFeedBackForObject`
                                 try{
                                     let params = {}
                                     params['objectType'] = FEEDBACK_OBJECT_TYPE
                                     params['objectIds']=testIds
                                     params['userId'] = this.props.userData ? this.props.userData._id:null
                                    let feedbackResult = await axios.post(server_url,params);
                                    if(feedbackResult.status===200){
                                        if(feedbackResult.data && feedbackResult.data.length){
                                            let submittedFeedbacks={}
                                            for(let feedback of feedbackResult.data){
                                                submittedFeedbacks[feedback.objectId] = feedback
                                            } 
                                            this.setState({submittedFeedbacks})
                                          } 
                                        }
                                     }
                                catch(err){
                                    alert("Something went wrong");
                                }
                            })
                         }
                    }
                    // this.props.setTestContent(result && result.data?result.data:{})
                }
                catch(err){
                 }
            }
        }
    } 


    DataHelpers={
        getResultData:(attempts)=>{
            let correct=0,incorrect=0
            let graphData = []
            if(!attempts){
                attempts = this.props.attempts
            }
            if(attempts && Object.keys(attempts).length){
                //  let attemptedQuestions = Object.keys(this.props.attempts)
                 for(let qId in attempts){
                      let attemptObj = attempts[qId]
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
        renderTestFeedback:(fetchedTest)=>{
           let testId = fetchedTest._id
           let feedback = this.state.submittedFeedbacks[testId]
           if(feedback){
            return(<div style={{padding:"20px"}}>
            <div><h4>Previous submitted feedback for the test.</h4></div>
           <Rating
           name="simple-controlled"
           value={feedback.feedbackValue}
           disabled
           />
         </div>)
           }
          
        },
        renderUserInfo:()=>{
        let welcomeMsg = `try this test for performance evaluation.`
        if(this.props.userData && this.props.userData.role===ROLE_ADMIN ) 
        {
            welcomeMsg = `You have accessed Content and Data Management System`
        }
        return(<React.Fragment><div style={{paddingTop:"30px",paddingBottom:"30px"}}>
            <h2><bold>{`Welcome ${this.props.userData.userName}`}</bold></h2>
            <h4>{welcomeMsg}</h4>
            <div style={{"display":"flex",justifyContent:"flex-start"}}>
            {this.props.userData && this.props.userData.role!==ROLE_ADMIN && 
            <div style={{width:"300px"}}><Button variant="contained" color="primary" onClick={this.Handlers.handlePreviousResultClick}>Previous results</Button>
                 </div>}
                 <div style={{width:"300px",marginLeft:"20px"}}><Button variant="contained" color="primary" onClick={this.Handlers.handleTestListClick}>Tests List</Button>
                 </div>     
            </div>
            </div></React.Fragment>)
        },
         
        renderLoginSignup:()=>{
            return(<div style={{width:"50%"}}><LoginSignup setUser={this.Handlers.setUser} /></div>)
        },

        renderQuestions:()=>{
           
            if(this.props.testContent){
            let questionElements = []  
            let questions = this.props.testContent.questions?this.props.testContent.questions:[]
            for(let question of questions){
                 questionElements.push(<Question attempts={this.props.attempts} testSubmitted={this.state.submitted} status={this.DataHelpers.getQuestionStatus(question.questionId)} question={question} />)
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
                 {!this.state.showLoginSignup && <Button variant="contained" color="primary" onClick={this.Handlers.handleLoginSignup}>
                 {this.state.headerButtonText}
                 </Button>}
             </div>
             </div>)
           },
           renderMainScreen:()=>{
            if(this.props.userData && this.props.userData.role===ROLE_ADMIN){
                return(<React.Fragment><div>{this.props.userData && this.Renderers.renderUserInfo()}</div>
                <AdminPanel />
                </React.Fragment>)      
            }
            else{
                if(this.state.selectedTest && Object.keys(this.state.selectedTest).length){
                    return(<React.Fragment>
                        <div>{this.props.userData && this.Renderers.renderUserInfo()}</div>
                         <div>{this.Renderers.renderQuestions()}</div>
                        <div>{this.Renderers.renderCTAs()}</div> 
                        {this.state.showResult && this.Renderers.renderResultSection()}
                        </React.Fragment>)
                }
                else if(this.state.fetchedTests && this.state.fetchedTests.length){
                   let testsList = []
                   for(let fetchedTest of this.state.fetchedTests){
                       testsList.push(<Card style={{marginTop:"40px"}}>
                        <CardContent>
                        <Typography style={{padding:"10px"}}>
                            <b>{fetchedTest.name}</b>
                        </Typography>
                        <Typography style={{padding:"10px"}}>
                            {`Subject : ${fetchedTest.subject}`}
                        </Typography>
                        <Typography style={{padding:"10px"}}>
                        {`Difficulty : ${fetchedTest.difficulty}`}
                        </Typography>
                        <Typography style={{padding:"10px"}}>
                        {`Target : ${fetchedTest.Target}`}
                        </Typography>
                        <Typography style={{padding:"10px"}}>
                        {`Grade : ${fetchedTest.grade}`}
                        </Typography>
                        <Typography style={{padding:"10px"}}>
                         {this.state.submittedFeedbacks && this.Renderers.renderTestFeedback(fetchedTest)}
                        </Typography>

                        <div style={{padding:"10px",width:"200px"}}>
                        <Button style={{marginTop:"30px"}} variant="contained" onClick={()=>this.Handlers.handleAttemptTest(fetchedTest)} color="primary">{`Attempt`}</Button>
                        </div>
                        </CardContent></Card>)
                   } 
                return(<React.Fragment>{testsList}</React.Fragment>)
                }
               
           }
            
           },
           renderResultSection:()=>{ 
            let resultElements = []
            if(this.state.resultType==='all'){
                resultElements.push( <Button style={{marginTop:"30px"}} onClick={this.Handlers.handleBackClick} color="primary">{`<- Back to questions`}</Button>)
                 
                if(this.state.prevSubmissions && this.state.prevSubmissions.length){
                    
                    for(let prevSub of this.state.prevSubmissions){
                        let submissionElement = [] 
                        let submission = prevSub
                          if(submission && submission.result){
                              let creationTime = submission.creationTime
                              let {attempts,precent} = submission.result
                              
                              submissionElement.push(<div>{`Percentage score:${precent}`}</div>)
                              if(creationTime){
                                submissionElement.push(<div>{`Submitted on:${new Date(creationTime).toString()}`}</div>)
                              }
                              if(attempts && Object.keys(attempts).length){
                              let graphData = this.DataHelpers.getResultData(attempts)
                              submissionElement.push(<div className="bar-graph-container"><BarGraph data={graphData}/></div>)
                           }
                           else{
                            submissionElement.push(<div><h3>No attempts done for this test.</h3></div>)
                           }
                        resultElements.push(<div style={{padding:"30px"}}>{submissionElement}</div>)  
                        }
                    } 
                }
                 else{
                    resultElements.push(<div style={{padding:"20px"}}>No submissions for you till now.</div>)
                }     
             }
            else{
                let graphData = this.DataHelpers.getResultData()
                let selectedTestId = this.state.selectedTest._id
                let feedback = this.state.submittedFeedbacks[selectedTestId]
                if(graphData.length){
                resultElements.push( <Button style={{marginTop:"30px"}} onClick={this.Handlers.handleBackClick} color="primary">{`<- Back to questions`}</Button>)
                resultElements.push(<div className="bar-graph-container"><BarGraph data={graphData}/></div>)
                resultElements.push(<Button variant="contained" color="primary" onClick={this.Handlers.submitResult}>Submit your result.</Button>)
                if(!this.state.submittedFeedbacks[this.state.selectedTest]){
                    resultElements.push(
                        <div style={{padding:"20px"}}>
                         <div><h2>Please provide test feedback here</h2></div>
                        <Rating
                        name="simple-controlled"
                        value={feedback}
                        onChange={this.Handlers.setTestRating}
                      />
                      </div>
                    )
                  }
                }            
            }
                return (<div className="result-container">{resultElements}</div>)
            }    
       }

    
    init(){
        this.fetchTests()
    }
    componentDidMount(){
        this.init()
    } 
    render(){
        return(<React.Fragment>
        <div className="test-container">
        <div className="test-container-header">{this.Renderers.renderHeader()}</div>
        { this.state.showLoginSignup ? this.Renderers.renderLoginSignup()
        :this.Renderers.renderMainScreen()}
            
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