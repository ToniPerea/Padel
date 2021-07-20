import React, {useState, useEffect} from 'react'
import { Link, Redirect } from 'react-router-dom'
import Layout from '../core/Layout'
import axios from 'axios'
import {ToastContainer , toast} from 'react-toastify'
import { isAuth, getCookie, signout, updateUser} from '../auth/helpers'

import 'react-toastify/dist/ReactToastify.min.css'

const Private = ({history}) => {
    const [values, setValues] = useState({
        role: '',
        name: '',
        email: '',
        password: '',
        buttonText: 'Enviar'
    });

    const token = getCookie('token');
    console.log(token)

    useEffect(() => {
        loadProfile()
    }, []) // esta parte de aqui hace referencia a que esta funcion funcionara siempre que haya algun cambio pero si en [] pusieramos [name] por ejemplo entonces solo funcionaria cuando en el name hubiera un cambio

    const loadProfile = () => {
        axios({
            method: 'GET',
            url: `${process.env.REACT_APP_API}/user/${isAuth()._id}`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response =>{
            console.log('PRIVATE PROFILE UPDATE', response)
            const {role, name, email} = response.data
            setValues({...values, role, name, email})
        })
        .catch(error => {
            console.log('PRIVATE PROFILE UPDATE ERROR', error.response.data.error)
            if(error.response.status === 401){
                signout(() => {
                    history.push('/')
                })
            }
        })
    }

    const {role,name,email,password,buttonText} = values

    const handleChange = (name) => (event) => {
        //console.log(event.target.value)
        setValues({...values,[name]: event.target.value})
    }

    const clickSubmit = event => {
        event.preventDefault()
        setValues({...values, buttonText: 'Enviando'})
        axios({
            method: 'PUT',
            url: `${process.env.REACT_APP_API}/user/update`,
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: {name, password}
        })
        .then(response => {
            console.log('PRIVATE PROFILE UPDATE SUCCESS', response)
            updateUser(response, () => {
                setValues({...values, buttonText:'Enviado'})
                toast.success('Perfil actualizado correctamente')
            })
        })
        .catch(error => {
            console.log('PRIVATE PROFILE UPDATE ERROR', error.response.data.error)
            setValues({...values,buttonText: 'Enviar'})
            toast.error(error.response.data.error)
        })
    }

    const updateForm = () => (
        <form>
            <div className="form-group">
                <label className="text-muted">Rol</label>
                <input defaultValue={role} type="text" className="form-control" disabled/>
            </div>

            <div className="form-group">
                <label className="text-muted">Nombre</label>
                <input onChange={handleChange('name')} value={name} type="text" className="form-control" />
            </div>

            <div className="form-group">
                <label className="text-muted">Email</label>
                <input defaultValue={email} type="email" className="form-control" disabled/>
            </div>

            <div className="form-group">
                <label className="text-muted">Contraseña</label>
                <input onChange={handleChange('password')} value={password} type="password" className="form-control" />
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
        <h1 className="pt-5 text-center">Private</h1>
        <p className="lead text-center">Actualización de Datos</p>
        {updateForm()}
        </div>
    </Layout>
    )
}


export default Private;