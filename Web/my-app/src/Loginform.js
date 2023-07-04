import React from "react";
import { Component } from "react";
import "./Form.css"
import axios from "axios"
import {AiOutlineUser} from "react-icons/ai"
import {RiLockPasswordFill} from "react-icons/ri"
import {GiCancel} from "react-icons/gi"
axios.defaults.withCredentials = true

class LoginForm extends Component{
    constructor(props){
        super(props)
        this.state = {error : false}
        this.submit = this.submit.bind(this)
    }

    submit(event){
        
        const data = new FormData(event.target)
        event.preventDefault()


        axios.post("http://localhost:4000/api/user/login",{login: data.get("prenom"), password : data.get("nom")},{withCredentials : true})
        .then((res) => {
            if (res.status === 200) this.props.checkCo()
        })
        .catch((res) => {
            this.setState({error : true})
        })

    }

    render(){
       return <div> <div id="main">
           <GiCancel id="cancelIcon" onClick={this.props.goBack}/>
            <form id="form1" className="form" onSubmit={this.submit}>
            <div className="field">
                <div id="PrenomID" className="infoP">
                    <div className="iconHolder">
                        <AiOutlineUser className="icons"/>
                    </div>
                    <input id="prenom"  className="champ" name="prenom" type="text" placeholder="Username"/>
                </div>
                <div className="infoP">
                    <div className="iconHolder">
                        <RiLockPasswordFill className="icons"/>
                    </div>
                    <input id="nom"  className="champ" name="nom" type="password" placeholder="Password"/>
                </div>
            </div>
            <div id="buttonHolder">
                <button id="BCOO" className="bn39" type="submit"><span class="bn39span">Connexion</span></button>
            </div>
            </form>
        </div>
        {this.state.error ? <div className="error">
                Mauvais login / mot de passe
        </div> : <span></span>}
        </div>
    }
}

export default LoginForm