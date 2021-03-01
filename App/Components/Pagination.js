import React, { Component } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

// Styles
import styles from './Styles/PaginationStyles'

export default class Pagination extends Component {
  constructor (props) {
    super(props)
    this.state = {
      totalItems: props.pageData.totalItems,
      numberOfPage: Math.ceil(Number(props.pageData.totalItems) / 24),
      page: (props.pageData.from / props.pageData.size) + 1
    }
  }

  renderSelectedPage = (currPage) => {
    if (currPage === this.state.page) {
      return (
        <View style={styles.btnPageSelected}>
          <Text style={styles.pageTextSelected}>{currPage}</Text>
        </View>
      )
    } else {
      return (
        <View style={styles.btnPage}>
          <Text style={styles.pageText}>{currPage}</Text>
        </View>
      )
    }
  }

  renderPagination = () => {
    let pagination = [] // Number of pages that will be shown
    let pageCount = 1 // Initial loop counter

    if (this.state.numberOfPage === 1) { // If there is only 1 page
      return null
    } else if (this.state.numberOfPage <= 5) { // If the number of pages is less then or equal to 5
      while (pageCount <= this.state.numberOfPage) {
        pagination.push(pageCount)
        pageCount++
      }
    } else { // If there are more then 5 pages
      if (this.state.page <= 3) { // Current viewed page is lower or equal to 3
        while (pageCount <= 5) {
          pagination.push(pageCount)
          pageCount++
        }
      } else if (this.state.page >= Number(this.state.numberOfPage) - 2) { // Current viewed page is greater then total pages - 2
        let startPage = Number(this.state.numberOfPage) - 4
        while (pageCount <= 5) {
          pagination.push(startPage)
          startPage++
          pageCount++
        }
      } else { // Current viewed page is in between 4 and totalPage - 2
        let startPage = this.state.page - 2
        while (pageCount <= 5) {
          pagination.push(startPage)
          startPage++
          pageCount++
        }
      }
    }

    return ( // Creating the page view
      <View style={{ flexDirection: 'row' }}>
        {pagination.map((page, index) => (
          <TouchableOpacity onPress={() => this.props.goToPage(page)} key={`page${page}${index}`}>
            {this.renderSelectedPage(page)}
          </TouchableOpacity>
        ))}
      </View>
    )
  }

  render () {
    return (
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <TouchableOpacity onPress={() => this.props.goBack()}>
            <View style={styles.arrowBtn}>
              <Icon name='chevron-left' size={16} />
            </View>
          </TouchableOpacity>
          {this.renderPagination()}
          <TouchableOpacity onPress={() => this.props.goForward()}>
            <View style={styles.arrowBtn}>
              <Icon name='chevron-right' size={16} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}
