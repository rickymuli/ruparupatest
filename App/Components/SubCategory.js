import React, { PureComponent } from 'react'
import { View, Dimensions, Alert } from 'react-native'
import HTML from 'react-native-render-html'
import { connect } from 'react-redux'
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'
import config from '../../config'

// Styles
import htmlStyles from '../Styles/RNHTMLStyles'

// Redux
import MiscActions from '../Redux/MiscRedux'

class SubCategory extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      verifyStatic: null,
      changeURL: false
    }
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    if (!isEqual(nextProps.misc.verifyStatic, prevState.verifyStatic) && !isEmpty(nextProps.misc.verifyStatic)) {
      return {
        verifyStatic: nextProps.misc.verifyStatic
      }
    } else {
      return null
    }
  }

  onLinkPress = (href) => {
    let urlKey = href.substring(config.baseURL.length, href.length)
    this.setState({
      verifyStatic: null,
      changeURL: true
    }, () => {
      this.props.verifyStaticPage(urlKey)
    })
  }

  componentDidUpdate () {
    const { verifyStatic, changeURL } = this.state
    if (!isEmpty(verifyStatic) && (verifyStatic.section === 'category' || verifyStatic.section === 'custom_category')) {
      if (changeURL) {
        const itemDetail = {
          data: {
            url_key: (verifyStatic.url_key.includes('.html')) ? verifyStatic.url_key : verifyStatic.url_key + '.html'
          },
          search: ''
        }
        this.setState({
          changeURL: false
        }, () => {
          this.props.navigation.navigate('ProductCataloguePage', { itemDetail })
        })
      }
    } else if (!isEmpty(verifyStatic) && verifyStatic.section === 'static page') {
      if (changeURL) {
        this.setState({ changeURL: false })
        Alert.alert('Alert!', 'This link will lead you to a static page which is still in Development. This alert will be removed after deployment')
      }
    }
  }

  render () {
    const subcategory = this.props.subcategory
    if (subcategory && subcategory.body_html) {
      return (
        <View>
          <HTML
            html={`
            <div class="explore-by-trending-content">
            ${subcategory.body_html}
            </div>
            `}
            classesStyles={htmlStyles.HTMLPCPSubcategoryClassStyle}
            tagsStyles={htmlStyles.HTMLPCPSubcategoryTagStyle}
            imagesMaxWidth={Dimensions.get('window').width * 0.5}
            onLinkPress={(evt, href) => { this.onLinkPress(href) }}
          />
        </View>
      )
    } else {
      return null
    }
  }
}

const stateToProps = (state) => ({
  misc: state.misc
})

const dispatchToProps = (dispatch) => ({
  verifyStaticPage: (pageData) => dispatch(MiscActions.miscVerifyStaticRequest(pageData))
})

export default connect(stateToProps, dispatchToProps)(SubCategory)
