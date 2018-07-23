import React from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import moment from 'moment'
import _ from 'lodash'
import { connect } from 'react-redux'
import { Form, Input, Modal, Select, Button } from 'antd'
import { withRouter } from 'react-router'
import { isLoggedInSelector, profileSelector } from './../../reducers/account'
import { enableSpinner, disableSpinner } from '../../actions/index';
const { TextArea } = Input

const uuidv1 = require('uuid/v1')
const Option = Select.Option
const FormItem = Form.Item

const ReviewListItem = ({ content, author, date }) => {
  return (
    <div className='review__item'>
      <div className='employee__text'>
        {`Review by ${author.firstName} ${author.lastName}`}
      </div>
      <div className='employee__datetime'>
        Submitted on {moment(date).format('MMMM DD, YYYY')}
      </div>
      <div className='employee__review-content'>
        { content }
      </div>
    </div>
  )
}

class Reviews extends React.Component {
  state = {
    review: null,
    visible: false
  }

  async componentDidMount() {
    this.fetchData(this.props.match.params.id)
  }

  setReview = (review) => {
    this.setState({
      review
    })
  }

  getUsernamyById = id => (this.state.employees.find(e => e._id === id))

  fetchData = async (id) => {
    this.props.enableSpinner()
    const { data } = await axios.get(
      `${process.env.API_URL}/reviews/${this.props.match.params.id}`,
      {
        headers: { Authorization: `Bearer ${this.props.jwt}` }
      }
    )
    this.setReview(data)
    // Add a little timeout for spinner
    setTimeout(() => {
      this.props.disableSpinner()
    }, 250)
  }

  deleteUser = async (id) => {
    try {
      const { data } = await axios.delete(
        `${process.env.API_URL}/reviews/${id}`,
        {
          headers: { Authorization: `Bearer ${this.props.jwt}` }
        }
      )
      this.fetchData()
    } catch (err) {
      console.log(err)
    }
  }

  confirmDelete = (id) => {
    const userObject = this.getUsernamyById(id)
    Modal.confirm({
      title: `Are you sure you want to delete user ${userObject.firstName} ${userObject.lastName}`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => {
        this.deleteUser(id)
      },
    })
  }

  handleOk = () => {
    this.setModalVisibility(false)
    this.fetchData()
  }

  setModalVisibility = (visible) => {
    this.setState({
      visible
    })
  }

  handleSubmit = async (e) => {
    e.preventDefault()
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        await axios.put(
          `${process.env.API_URL}/reviews/${this.props.match.params.id}`,
          values,
          {
            headers: { Authorization: `Bearer ${this.props.jwt}` }
          }
        )
        this.fetchData()
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const reviewsRaw = _.get(this.state.review, 'participants', [])
    // Display only submitted reviews
    const reviewsFiltered = reviewsRaw.filter(e => e.submitted)

    let author = _.get(this.state.review, 'author')
    const profile = this.props.profile

    const reviews = reviewsFiltered.length > 0 ? (reviewsFiltered.map(e => (
      <ReviewListItem {...e} key={uuidv1()} />
    ))) : 'No Reviews Yet'

    const userReview = reviewsRaw.find(e => e.author._id === this.props.profile.id)
    const isSubmitted = _.get(userReview, 'submitted', true)

    return (
      <div className='content__wrapper'>
          <div>
            {(this.state.review && !isSubmitted) && 
              <div>
                <h1>Please submit your feedback for {`Alex Davidson`}</h1>
                <div>
                  {`Feedback requested by ${author.firstName} ${author.lastName}`}
                </div>
                <Form style={{ marginTop: 20 }} onSubmit={this.handleSubmit} className='login-form'>
                  <FormItem>
                    {getFieldDecorator('content', {
                      rules: [{ required: true, message: 'Please enter your feedback' }],
                    })(
                      <TextArea placeholder="Enter your feedback" autosize={{ minRows: 10, maxRows: 15 }} />
                    )}
                  </FormItem>
                  <FormItem className='text-right'>
                    <Button size='large' type='primary' htmlType='submit' className='login-form-button'>
                      Submit Feedback
                    </Button>
                  </FormItem>
                </Form>
              </div>
            }
            <h1>List of performance reviews</h1>
            {reviews}
          </div>
      </div>
    )
  }
}

Reviews.propTypes = {
  jwt: PropTypes.string
}

function mapStateToProps(state) {
  return {
    jwt: isLoggedInSelector(state),
    profile: profileSelector(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    enableSpinner: () => { dispatch(enableSpinner()) },
    disableSpinner: () => { dispatch(disableSpinner())}
  }
}

const ReviewsComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(Reviews)

const WrappedReviewsComponent = Form.create()(ReviewsComponent)

export default withRouter(WrappedReviewsComponent)