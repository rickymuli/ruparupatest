import React, { PureComponent } from 'react'
import Toast from 'react-native-easy-toast'

class GlobalToast extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      message: '',
      duration: this.props.duration || 250,
      position: this.props.position || 'top',
      positionValue: this.props.positionValue || 0,
      opacity: this.props.opacity || 1,
      fadeInDuration: this.props.fadeInDuration || 750,
      fadeOutDuration: this.props.fadeOutDuration || 1500,
      style: this.props.style || { width: '100%', backgroundColor: '#049372', borderRadius: 0 },
      textStyle: this.props.textStyle || { color: '#FFFFFF', textAlign: 'center' }
    }
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    if (nextProps.message) {
      return {
        message: nextProps.message
      }
    }
  }

  componentDidUpdate () {
    if (this.state.message) {
      this.showToast(this.state.message)
    }
  }

  showToast = (message) => {
    const { duration } = this.state
    this.setState({
      message: ''
    })
    this.refs.toast.show(message, duration, () => {
      this.props.toggleWishlist('')
    })
  }

  render () {
    const { position, positionValue, opacity, fadeInDuration, fadeOutDuration, style, textStyle } = this.state
    return (
      <Toast
        ref='toast'
        style={style}
        position={position}
        positionValue={positionValue}
        fadeInDuration={fadeInDuration}
        fadeOutDuration={fadeOutDuration}
        opacity={opacity}
        textStyle={textStyle}
      />
    )
  }
}

export default (GlobalToast)
