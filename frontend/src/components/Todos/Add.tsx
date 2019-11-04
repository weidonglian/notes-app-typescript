import React from 'react'
import { Dispatch } from 'redux'
import { addTodo } from '../../actions/todos';
import { connect } from 'react-redux';

interface UiTodosAddProps {
    add: (name: string) => void;
}

interface UiTodosAddState {
    name: string
}

class UiTodosAdd extends React.PureComponent<UiTodosAddProps, UiTodosAddState> {
    state: UiTodosAddState = {
        name: ''
    }

    onInputChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const val = evt.target.value;
        this.setState((prevState: Readonly<UiTodosAddState>) => ({
            ...prevState,
            name: val
        }));
    }

    onButtonSubmit = (evt: React.MouseEvent<HTMLButtonElement>) => {
        evt.preventDefault();
        this.props.add(this.state.name);
    }

    render() {
        const { add } = this.props;

        return (
            <div>
                <h1>Add a new todo</h1>
                <input value={this.state.name} onChange={this.onInputChange}></input>
                <button onClick={e=>this.state.name && add(this.state.name)}>Add</button>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
    add: (name: string) => dispatch(addTodo(name))
});

export const TodosAdd = connect(
    null, mapDispatchToProps
)(UiTodosAdd)

