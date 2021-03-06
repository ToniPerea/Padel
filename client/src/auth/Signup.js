import React, {useState} from 'react'
import { Redirect } from 'react-router-dom'
import Layout from '../core/Layout'
import axios from 'axios'
import {ToastContainer , toast} from 'react-toastify'
import { isAuth } from './helpers'

import 'react-toastify/dist/ReactToastify.min.css'

const Signup = () => {
    const [values, setValues] = useState({
        name: '',
        surname: '',
        email: '',
        password: '',
        phone: '',
        buttonText: 'Registrar'
    });

    const {name,surname,email,password,phone,buttonText} = values

    const handleChange = (name) => (event) => {
        //console.log(event.target.value)
        setValues({...values,[name]: event.target.value})
    }

    const clickSubmit = event => {
        event.preventDefault()
        setValues({...values, buttonText: 'Registrando'})
        axios({
            method: 'POST',
            url: `${process.env.REACT_APP_API}/signup`,
            data: {name,surname, email,password,phone}
        })
        .then(response => {
            console.log('SIGNUP SUCCESS', response)
            setValues({...values,name: '',surname: '',email: '',password: '',phone: '', buttonText:'Registrado'})
            toast.success(response.data.message)
        })
        .catch(error => {
            console.log('SIGNUP ERROR', error.response.data)
            setValues({...values,buttonText: 'Registrar'})
            toast.error(error.response.data.error)
        })
    }

    const signupForm = () => (
        <form>
            <div className="form-group">
                <label className="text-muted">Nombre</label>
                <input onChange={handleChange('name')} value={name} type="text" className="form-control" />
            </div>

            <div className="form-group">
                <label className="text-muted">Apellidos</label>
                <input onChange={handleChange('surname')} value={surname} type="text" className="form-control" />
            </div>

            <div className="form-group">
                <label className="text-muted">Email</label>
                <input onChange={handleChange('email')} value={email} type="email" className="form-control" />
            </div>

            <div className="form-group">
                <label className="text-muted">Contrase??a</label>
                <input onChange={handleChange('password')} value={password} type="password" className="form-control" />
            </div>

            <div className="form-group">
                <label className="text-muted">N??mero de Tel??fono</label>
                <input onChange={handleChange('phone')} value={phone} type="number" className="form-control" />
            </div>

            <div>
                <button className="btn btn-primary" onClick={clickSubmit}>
                    {buttonText}
                </button>
            </div>
        </form>
    )


    return (<Layout>
        <div className="col-md-6 offset-md-3">
        <ToastContainer />
        {isAuth() ? <Redirect to="/" /> : null}
        <h1 className="p-5 text-center">Registro</h1>
        {signupForm()}
        </div>
    </Layout>
    )
}


export default Signup;