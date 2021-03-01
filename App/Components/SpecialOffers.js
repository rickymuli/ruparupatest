import React, { Component } from 'react'
import { connect } from 'react-redux'
import config from '../../config'
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'
import HTML from 'react-native-render-html'

// Redux
import MiscActions from '../Redux/MiscRedux'
// import CategoryDetailActions from '../Redux/CategoryDetailRedux'

// Styles
import htmlStyles from '../Styles/RNHTMLStyles'

class SpecialOffers extends Component {
  constructor (props) {
    super(props)
    this.state = {
      misc: props.misc || null,
      verifyStatic: null,
      // categoryDetail: null,
      changeURL: false,
      itemDetail: null
    }
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    if (!isEqual(nextProps.misc.favoriteCategory, prevState.misc.favoriteCategory)) {
      return {
        misc: nextProps.misc
      }
    } else if (!isEqual(nextProps.misc.verifyStatic, prevState.verifyStatic) && !isEmpty(nextProps.misc.verifyStatic)) {
      return {
        verifyStatic: nextProps.misc.verifyStatic
      }
    } else {
      return null
    }
  }

  componentDidMount () {
    this.props.miscGetFavoriteCategory(`favorite-category-${config.environment}`)
  }

  componentDidUpdate () {
    const { verifyStatic, changeURL } = this.state
    if (!isEmpty(verifyStatic) && (verifyStatic.section === 'category' || verifyStatic.section === 'custom_category')) {
      if (changeURL) {
        const itemDetail = {
          data: {
            url_key: verifyStatic.url_key
          },
          search: ''
        }
        this.setState({
          changeURL: false,
          itemDetail
        }, () => { this.props.navigation.navigate('ProductCataloguePage', { itemDetail }) })
      }
    } else if (!isEmpty(verifyStatic) && verifyStatic.section === 'static page') {
      if (changeURL) {
        this.setState({ changeURL: false })
        // Alert.alert('Alert!', 'This link will lead you to a static page which is still in Development. This alert will be removed after deployment')
        this.props.navigation.navigate('StaticPage', {
          itemDetail: {
            url_key: verifyStatic.url_key
          }
        })
      }
    }
  }

  onLinkPress = (href) => {
    let urlKey = href.substring(config.baseURL.length, href.length)
    this.setState({ verifyStatic: null, changeURL: true }, () => {
      this.props.verifyStaticPage(urlKey)
    })
  }

  render () {
    const { misc } = this.state
    if (isEmpty(misc.favoriteCategory) || misc.fetchingFavoriteCategory) {
      return null
    } else {
      // Image with format jpg & png can be rendered with package rn-render-html
      return (
        <HTML
          onLinkPress={(evt, href) => { this.onLinkPress(href) }}
          html={misc.favoriteCategory.body_html}
          classesStyles={htmlStyles.HTMLSpecialOffersClassStyles}
          tagsStyles={htmlStyles.HTMLSpecialOffersTagsStyles}
        />
      )
    }
  }
}

const stateToProps = (state) => ({
  misc: state.misc
  // categoryDetail: state.categoryDetail
})

const dispatchToProps = (dispatch) => ({
  miscGetFavoriteCategory: (identifier) => dispatch(MiscActions.miscGetFavoriteCategory(identifier)),
  // fetchCategoryDetail: (urlKey) => dispatch(CategoryDetailActions.categoryDetailRequest(urlKey)),
  verifyStaticPage: (pageData) => dispatch(MiscActions.miscVerifyStaticRequest(pageData))
})

export default connect(stateToProps, dispatchToProps)(SpecialOffers)
