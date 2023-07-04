import React from "react";
import { Component } from "react";
import {GoSearch} from "react-icons/go";
import "./Twall.css"

class NavBar extends Component{
    constructor(props){
        super(props)
        this.submit = this.submit.bind(this)
    }
    submit(event){
        const data = new FormData(event.target)
        event.preventDefault()
        document.getElementById("recherche").value = ""

        this.props.find(data.get("recherche"))


    }
    render(){
        return <div><div >
                <form id="NavBar" onSubmit={this.submit}>
                    <div class="wrap">
                        <div class="search">
                            <input id="recherche" name="recherche" type="text" class="searchTerm" placeholder="Trouver un message"/>
                            <button type="submit" class="searchButton">
                                <GoSearch/>
                            </button>
                        </div>
                    </div>
                </form>
                </div>
            </div>
    }
}

export default NavBar