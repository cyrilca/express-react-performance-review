import React from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import moment from 'moment'
import _ from 'lodash'
import { connect } from 'react-redux'
import { Form, Input, Button, Modal, Select, Tag } from 'antd'
import { Link } from 'react-router-dom'
import { isLoggedInSelector, profileSelector } from './../../reducers/account'

const uuidv1 = require('uuid/v1')
const Option = Select.Option
const FormItem = Form.Item

const ReviewItem = ({
  target, createdAt, _id, confirmDelete, isAdmin, participants, id
}) => {
  const participantObject = participants.find(e => e.author === id)
  const isSubmitted = _.get(participantObject, 'submitted', true)
  return (
    <div className='employee__row'>
      <div className='employee__left'>
        <Link to={`/reviews/${_id}`}>
          <div className='employee__text'>
            {
              target &&
              <div className='performance__title'>
                {`Performance review of ${target.firstName} ${target.lastName}`}
              </div>
            }
            {
              !isSubmitted &&
              <Tag style={{ marginLeft: 5 }} color='green'>Feedback required</Tag>
            }
          </div>
          <div className='employee__type'>
            Created on {moment(createdAt).format('DD MMMM, YYYY')}
          </div>
        </Link>
      </div>
      {
        isAdmin &&
        <div>
          <div className='employee__buttons'>
            <button onClick={() => { confirmDelete(_id) }} className='btn--delete'>
              <i className='fa fa-trash-o' aria-hidden='true'></i>
            </button>
          </div>
        </div>
      }
    </div>
  )
}

class Reviews extends React.Component {
  state = {
    reviews: [],
    visible: false,
    users: []
  }

  async componentDidMount() {
    this.fetchData()
    this.fetchUserList()
  }

  setReviews = (reviews) => {
    this.setState({
      reviews
    })
  }

  setUsers = (users) => {
    this.setState({
      users
    })
  }

  fetchUserList = async () => {
    const { data } = await axios.get(
      `${process.env.API_URL}/employees`,
      {
        headers: { Authorization: `Bearer ${this.props.jwt}` }
      }
    )
    this.setUsers(data)
  }

  // getReviewById = id => (this.state.employees.find(e => e._id === id))
  fetchData = async () => {
    const { data } = await axios.get(
      `${process.env.API_URL}/reviews`,
      {
        headers: { Authorization: `Bearer ${this.props.jwt}` }
      }
    )
    this.setReviews(data)
  }

  deleteReviewById = async (id) => {
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
    // const userObject = this.getReviewById(id)
    Modal.confirm({
      title: `Are you sure you want to delete review`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => {
        this.deleteReviewById(id)
      }
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
        await axios.post(
          `${process.env.API_URL}/reviews`,
          values,
          {
            headers: { Authorization: `Bearer ${this.props.jwt}` }
          }
        )
        this.setModalVisibility(false)
        this.fetchData()
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const isAdmin = this.props.profile.type === 'admin'
    let list = this.state.reviews.map(e => (<ReviewItem
      confirmDelete={this.confirmDelete}
      key={uuidv1()}
      isAdmin={isAdmin}
      id={this.props.profile.id}
      {...e}
    />))

    if (list.length === 0) {
      list = <div>No required reviews yet</div>
    }

    // Render only for admin
    const addNewReview = this.props.profile.type === 'admin' ? (
      <div className='text-right'>
        <button
          onClick={() => { this.setModalVisibility(true) }}
          className='btn--new'
        >
          Add New Review
        </button>
      </div>
    ) : null

    const userList = this.state.users.map(e =>
      <Option key={`${e._id}`}>{`${e.firstName} ${e.lastName}`}</Option>
    )

    return (
      <div className='content__wrapper'>
        <Modal
          title='Add new review'
          visible={this.state.visible}
          onCancel={() => { this.setModalVisibility(false) }}
          footer={null}
        >
          <Form onSubmit={this.handleSubmit} className='login-form'>
            <FormItem>
              {getFieldDecorator('body', {
                rules: [{ required: true, message: 'Enter description' }],
              })(
                <Input placeholder='Review description' size='large' />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('target', {
                rules: [{ required: true, message: 'Please select employee you want to review' }],
              })(
                <Select
                  style={{ width: '100%' }}
                  placeholder='Employee requiring review'
                  size='large'
                >
                  {userList}
                </Select>
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('participants', {
                rules: [{ required: true, message: 'Please select employees you require feedback from' }],
              })(
                <Select
                  mode='multiple'
                  style={{ width: '100%' }}
                  placeholder='Please select people who will participate in the review'
                  onChange={handleChange}
                  size='large'
                >
                  {userList}
                </Select>
              )}
            </FormItem>
            <FormItem className='text-center'>
              <Button type='primary' htmlType='submit' className='login-form-button'>
                Create Review
              </Button>
            </FormItem>
          </Form>
        </Modal>
        {addNewReview}
        {list}
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

const ReviewsComponent = connect(
  mapStateToProps,
  null
)(Reviews)

const WrappedReviewsComponent = Form.create()(ReviewsComponent)

export default WrappedReviewsComponent