import React, {Component, Fragment} from "react";
import './EditMovie.css';
import Input from "./form-components/Input";
import TextArea from "./form-components/TextArea";
import Select from "./form-components/Select";
import Alert from "./ui-components/Alert";
import {Link} from "react-router-dom";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

export default class EditMovie extends Component {

    constructor(props) {
        super(props);

        this.state ={
            movie: {
                id: 0,
                title: '',
                release_date: '',
                run_time: '',
                mpaa_rating: '',
                rating: '',
                description: '',
            },
            mpaaOptions: [
                {id: 'G', value: 'G'},
                {id: 'PG', value: 'PG'},
                {id: 'PG13', value: 'PG13'},
                {id: 'R', value: 'R'},
                {id: 'NC17', value: 'NC17'},
            ],
            isLoaded: false,
            error: null,
            errors: [],
            alert: {
                type: "d-none",
                message: ""
            }
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit = event => {
        event.preventDefault();

        let errors = [];
        if (this.state.movie.title === '') {
            errors.push('title');
        }
        if (this.state.movie.release_date === '') {
            errors.push('release_date');
        }
        if (this.state.movie.run_time === '') {
            errors.push('run_time');
        }
        if (this.state.movie.mpaa_rating === '') {
            errors.push('mpaa_rating');
        }
        if (this.state.movie.rating === '') {
            errors.push('rating');
        }
        if (this.state.movie.description === '') {
            errors.push('description');
        }

        this.setState({errors: errors});

        if (errors.length > 0) {
            return false;
        }

        const data = new FormData(event.target);
        const payload = Object.fromEntries(data.entries());

        const requestOptions = {
            method: 'POST',
            body: JSON.stringify(payload)
        }

        fetch('http://localhost:4000/v1/admin/editmovie', requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    this.setState({
                        alert: {type: "alert-danger", message: data.error.message}
                    })
                } else {
                    this.props.history.push({
                        pathname: '/admin'
                    })
                }
            })
    }

    handleChange = (event) => {
        let value = event.target.value;
        let name = event.target.name;
        this.setState(prevState => ({
            movie: {
                ...prevState.movie,
                [name]: value
            }
        }))
    }

    hasError(key) {
        return this.state.errors.indexOf(key) !== -1;
    }

    componentDidMount() {
        const id = this.props.match.params.id;
        if (id > 0) {
            fetch('http://localhost:4000/v1/movie/' + id)
                .then(response => {
                    if (response.status !== 200) {
                        let err = new Error('Invalid response code: ' + response.status)
                        this.setState({error: err})
                    }
                    return response.json()
                })
                .then(json => {
                    const releaseDate = new Date(json.movie.release_date);

                    this.setState({
                        movie: {
                            id: id,
                            title: json.movie.title,
                            release_date: releaseDate.toISOString().split('T')[0],
                            run_time: json.movie.run_time,
                            mpaa_rating: json.movie.mpaa_rating,
                            rating: json.movie.rating,
                            description: json.movie.description
                        },
                        isLoaded: true
                    })
                })
        } else {
            this.setState({isLoaded: true})
        }
    }

    confirmDelete = (event) => {
        confirmAlert({
            title: 'Delete Movie',
            message: 'Are you sure?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        fetch('http://localhost:4000/v1/admin/deletemovie/' + this.state.movie.id, {method: 'GET'})
                            .then(response => response.json)
                            .then(data => {
                                if (data.error) {
                                    this.setState({
                                        alert: {type: 'alert-danger', message: data.error.message}
                                    })
                                } else {
                                    this.props.history.push({
                                        pathname: '/admin'
                                    })
                                }
                            })
                    }
                },
                {
                    label: 'No',
                    onClick: () => {}
                }
            ]
        });
    }

    render() {
        let {movie, isLoaded, error} = this.state

        if (error) {
            return <div>Error: {error.message}</div>
        } else if (!isLoaded) {
            return <p>Loading...</p>
        } else {
            return (
                <Fragment>
                    <h2>Add/Edit Movie</h2>
                    <Alert
                        alertType={this.state.alert.type}
                        alertMessage={this.state.alert.message}
                    />
                    <hr/>
                    <form onSubmit={this.handleSubmit}>
                        <input
                            type="hidden"
                            name="id"
                            id="id"
                            value={movie.id}
                            onChange={this.handleChange}
                        />

                        <Input
                            title={'Title'}
                            className={this.hasError('title') ? 'is-invalid' : ''}
                            type={'text'}
                            name={'title'}
                            value={movie.title}
                            handleChange={this.handleChange}
                            errorDiv={this.hasError('title') ? 'text-danger' : 'd-none'}
                            errorMsg={'Please enter a title'}
                        />

                        <Input
                            title={'Release Date'}
                            className={this.hasError('release_date') ? 'is-invalid' : ''}
                            type={'date'}
                            name={'release_date'}
                            value={movie.release_date}
                            handleChange={this.handleChange}
                            errorDiv={this.hasError('release_date') ? 'text-danger' : 'd-none'}
                            errorMsg={'Please enter a release date'}
                        />

                        <Input
                            title={'Run Time'}
                            className={this.hasError('run_time') ? 'is-invalid' : ''}
                            type={'text'}
                            name={'run_time'}
                            value={movie.run_time}
                            handleChange={this.handleChange}
                            errorDiv={this.hasError('run_time') ? 'text-danger' : 'd-none'}
                            errorMsg={'Please enter a run time'}
                        />

                        <Select
                            title={'MPAA Rating'}
                            className={this.hasError('mpaa_rating') ? 'is-invalid' : ''}
                            name={'mpaa_rating'}
                            options={this.state.mpaaOptions}
                            value={movie.mpaa_rating}
                            placeholder={'Choose...'}
                            handleChange={this.handleChange}
                            errorDiv={this.hasError('mpaa_rating') ? 'text-danger' : 'd-none'}
                            errorMsg={'Please enter a MPAA rating'}
                        />

                        <Input
                            title={'Rating'}
                            className={this.hasError('rating') ? 'is-invalid' : ''}
                            type={'text'}
                            name={'rating'}
                            value={movie.rating}
                            handleChange={this.handleChange}
                            errorDiv={this.hasError('rating') ? 'text-danger' : 'd-none'}
                            errorMsg={'Please enter a rating'}
                        />

                        <TextArea
                            title={'Description'}
                            className={this.hasError('description') ? 'is-invalid' : ''}
                            name={'description'}
                            rows={3}
                            value={movie.description}
                            handleChange={this.handleChange}
                            errorDiv={this.hasError('description') ? 'text-danger' : 'd-none'}
                            errorMsg={'Please enter a description'}
                        />
                        <hr/>
                        <button className="btn btn-primary">Save</button>
                        <Link to="/admin" className="btn btn-warning ms-1">Cancel</Link>
                        {movie.id > 0 && (
                            <a href="#!" onClick={this.confirmDelete} className="btn btn-danger ms-1">Delete</a>
                        )}
                    </form>

                    {/*<div className="mt-3">*/}
                    {/*    <pre>*/}
                    {/*        {JSON.stringify(this.state, null, 3)}*/}
                    {/*    </pre>*/}
                    {/*</div>*/}
                </Fragment>
            )
        }
    }
}
