import React, {Component} from "react";
import moment from 'moment';
import PageTitle from "../../../components/PageTitle";
import connect from "react-redux/es/connect/connect";
import defaultStyles from '../styles.scss';
import styles from './styles.scss';
import {expenseDetailDateSelector, expenseSelector, expenseTypeSelector} from "../selectors";
import {DropdownButton, MenuItem} from 'react-bootstrap';
import {deleteExpenses, setEditExpenses} from '../actions'
import history from '../../../history';
import {farmSelector} from "../../selector";
import {grabCurrencySymbol} from "../../../util";
import ConfirmModal from "../../../components/Modals/Confirm";

class ExpenseDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: null,
      expenseItems: [],
      total: 0,
      filteredExpenses: [],
      currencySymbol: '$',
      showModal: false, // for confirming deleting all expenses
    };
    this.getExpensesByDate = this.getExpensesByDate.bind(this);
    this.getExpenseType = this.getExpenseType.bind(this);
    this.editExpenses = this.editExpenses.bind(this);
  }

  componentDidMount() {
    const {expense_detail_date, farm} = this.props;
    this.setState({ currencySymbol: grabCurrencySymbol(farm) });
    let date = moment(expense_detail_date).format('MMM DD, YYYY');
    this.setState({
      date
    });
    this.getExpensesByDate();
  }

  getExpensesByDate() {
    const {expense_detail_date, expenses} = this.props;
    let targetDate = moment(expense_detail_date).format('YYYY-MM-DD');
    let dict = {};
    let total = 0;
    let filteredExpenses = [];
    for (let e of expenses) {
      let expenseDate = moment(e.expense_date).format('YYYY-MM-DD');
      if (targetDate === expenseDate) {
        let id = e.expense_type_id;
        total += parseFloat(e.value);
        filteredExpenses.push(e);
        if (!dict.hasOwnProperty(id)) {
          dict[id] = {
            type_name: this.getExpenseType(id),
            items: [
              {
                note: e.note,
                value: e.value,
              }
            ]
          }
        } else {
          dict[id].items.push({
            note: e.note,
            value: e.value,
          })
        }
      }
    }

    this.setState({
      expenseItems: Object.values(dict),
      total: total.toFixed(2),
      filteredExpenses,
    });
  }

  getExpenseType(id) {
    const {expenseTypes} = this.props;
    for (let type of expenseTypes) {
      if (type.expense_type_id === id) {
        return type.expense_name;
      }
    }
    return 'TYPE_NOT_FOUND';
  }
  
  handledeleteExpenses = () => {
    this.setState({showModal: true});
  }

  deleteExpenses = () => {
    // eslint-disable-next-line
    let farmIDs = [];
    const {filteredExpenses} = this.state;
    for (let f of filteredExpenses) {
      farmIDs.push(f.farm_expense_id);
    }
    if(farmIDs.length > 0){
      this.props.dispatch(deleteExpenses(farmIDs));
      history.push('/other_expense');
    }
  }

  editExpenses(){
    const {filteredExpenses} = this.state;
    this.props.dispatch(setEditExpenses(filteredExpenses));
    history.push('/edit_expense_categories');
  }

  render() {
    let dropDown = 0;
    const {date, expenseItems, total} = this.state;
    return (
      <div className={defaultStyles.financesContainer}>
        <PageTitle backUrl='/other_expense' title='Expense Detail'/>
        <div className={styles.innerInfo}>
          <h4>{date}</h4>
          <DropdownButton
            style={{background: '#EFEFEF', color: '#4D4D4D', border: 'none'}}
            title={'Edit'}
            key={dropDown}
            id={`dropdown-basic-${dropDown}`}
          >
            <MenuItem eventKey="0" onClick={()=>this.editExpenses()} >Edit</MenuItem>
            <MenuItem eventKey="1" onClick={() => {this.handledeleteExpenses()}}>Delete</MenuItem>
          </DropdownButton>
        </div>

        <div className={styles.itemContainer}>
          <h4><strong>Expense Description</strong></h4>
          <div>Cost</div>
        </div>
        {
          expenseItems.length > 0 &&
          expenseItems.map((e) => {
            return <div key={e.type_name}>
              <div className={styles.typeNameContainer}>
                <h4><strong>{e.type_name}</strong></h4>
              </div>
              {
                e.items.length > 0 &&
                e.items.map((i) => {
                  return <div key={i.note + i.value.toString()} className={styles.itemContainer}>
                    <div>
                      {'- ' + i.note}
                    </div>
                    <div className={styles.greenText}>
                      {this.state.currencySymbol + i.value.toFixed(2).toString()}
                    </div>
                  </div>
                })
              }
            </div>
          })
        }
        <div className={styles.itemContainer}>
          <h4><strong>Total</strong></h4>
          <div className={styles.greenText} id="total-amount">{this.state.currencySymbol + total}</div>
        </div>
        <ConfirmModal
            open={this.state.showModal}
            onClose={() => this.setState({showModal: false})}
            onConfirm={() => {
              this.deleteExpenses();
              this.setState({showModal: false});
            }}
            message='Are you sure you want to delete all the expenses on this page? Note: To delete a specific expense go to Edit.'
          />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    expense_detail_date: expenseDetailDateSelector(state),
    expenses: expenseSelector(state),
    expenseTypes: expenseTypeSelector(state),
    farm: farmSelector(state),
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(ExpenseDetail);
