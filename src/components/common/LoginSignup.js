import React,{Component} from 'react'
const FORM_TYPE_SIGN_UP="signup"
const FORM_TYPE_LOG_IN="login"
import axios from 'axios'
import Button from '@material-ui/core/Button';


class LoginSignup extends Component{
   constructor(props){
      super(props)
      this.state={formType:FORM_TYPE_SIGN_UP,email:null,userName:null,password:null}
   }   
   
   Handlers = {
      handleLoginClick:()=>{
         let formType=this.state.formType===FORM_TYPE_LOG_IN?FORM_TYPE_SIGN_UP:FORM_TYPE_LOG_IN
         this.setState({formType:formType}) 
      },
      setUserInput:(field,e)=>{
          let value = e.target.value
          this.setState({[field]:value})
      },
      handleSubmit:async()=>{
          let serverUrl=`http://localhost:4000/`
          let api
          if(this.state.formType===FORM_TYPE_LOG_IN){
             api='loginUser'
          }
          else{
             api='signupUser'
          }
          let url=serverUrl+api
          let params={}
          if(this.state.formType===FORM_TYPE_LOG_IN){
            params['email']=this.state.email
            params['password']=this.state.password
         }
         else{
            params['email']=this.state.email
            params['password']=this.state.password
            params['userName']=this.state.userName   
         }  
         try{
            let result = await axios.post(url,params)
            if(result.status===200){
                alert(`${this.state.formType===FORM_TYPE_LOG_IN?"login":"signup"} successful`);
                this.props.setUser(result.data)
               }
            else{
                alert("Something went wrong");
            }
             }
        catch(err){
         alert("Something went wrong, Please try again later");
        } 
 

      }

   }

   Renderers = {
        renderLoginButton:()=>{
          return(<div style={{paddingTop:"20px",paddingBottom:"20px",width:"30%"}}>
          <Button variant="contained" color="default" onClick={this.Handlers.handleLoginClick}>
          {`${this.state.formType===FORM_TYPE_LOG_IN?"Sign up":"Log in"}`}
          </Button>
      </div>)

        },
        renderSignUpFields:()=>{
           return(
              <React.Fragment>
              <label for="psw-repeat"><b>User Name</b></label>
              <input type="text" placeholder="User name" name="userName" value = {this.state['userName']} onChange={(e)=>this.Handlers.setUserInput('userName',e)} required />
              </React.Fragment>
           )
        }

   }

   render(){
      return(<div class="container">
        <h1>{this.state.formType===FORM_TYPE_LOG_IN?"Please enter login credentials":"SignUp:Please enter sign up details"}</h1>
       {this.Renderers.renderLoginButton()}
        <label for="email"><b>Email</b></label>
        <input type="text"   placeholder="Enter Email" name="email" onChange={(e)=>this.Handlers.setUserInput('email',e)} required />
        
        <label for="psw"><b>Password</b></label>
        <input type="password" value={this.state["password"]} placeholder="Enter Password" onChange={(e)=>this.Handlers.setUserInput('password',e)} name="psw" required />
        {this.state.formType===FORM_TYPE_SIGN_UP && this.Renderers.renderSignUpFields()}
        <div class="clearfix">
          <button onClick={this.Handlers.handleSubmit} type="submit" class="signupbtn">{this.state.formType===FORM_TYPE_LOG_IN?"Login":"Sign up"}</button>
        </div>
      </div>)
   } 

}
export default LoginSignup;