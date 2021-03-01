import React, { Component } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, Animated } from 'react-native'

export default class Panel extends Component {
  constructor (props) {
    super(props)
    // Change this image with the final icon image
    this.icons = {
      'plus': require('../Images/Icons/plus-icon.webp'),
      'minus': require('../Images/Icons/minus-icon.webp')
    }
    this.state = {
      title: props.title.categoryData.name,
      data: props.title.categoryData,
      children: props.title.children,
      expanded: true,
      animation: new Animated.Value()
    }
  }

  toggle () {
    let initialValue = this.state.expanded ? this.state.maxHeight + this.state.minHeight : this.state.minHeight
    let finalValue = this.state.expanded ? this.state.minHeight : this.state.maxHeight + this.state.minHeight

    this.setState({
      expanded: !this.state.expanded
    })

    this.state.animation.setValue(initialValue)
    Animated.spring(
      this.state.animation,
      {
        toValue: finalValue
      }
    ).start()
  }

  _setMaxHeight (event) {
    this.setState({
      maxHeight: event.nativeEvent.layout.height
    })
  }

  _setMinHeight (event) {
    this.setState({
      minHeight: event.nativeEvent.layout.height
    })
  }

  propsNavigation = (category, subCategory) => {
    let categoryDetail =
      {
        subCategory: subCategory,
        category: category
      }
    this.props.parentNavigationReference(categoryDetail)
  }

  render () {
    let icon = this.icons['plus']

    if (this.state.expanded) {
      icon = this.icons['minus']
    }

    return (
      <Animated.View style={[styles.container, { height: this.state.animation }]}>
        <View style={styles.titleContainer} onLayout={this._setMinHeight.bind(this)}>
          <Text style={styles.title}>{this.state.title}</Text>
          <TouchableOpacity onPress={this.toggle.bind(this)}>
            <Image
              style={styles.buttonImage}
              source={icon}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.body} onLayout={this._setMaxHeight.bind(this)}>
          <TouchableOpacity onPress={() => this.propsNavigation(`Tampilkan Semua`, this.state.data)} key={`panelChildrenTampilkan Semua-1${this.state.title}`}>
            <Text style={styles.title}>Tampilkan Semua</Text>
          </TouchableOpacity>
          {this.state.children.map((child, index) => (
            <TouchableOpacity onPress={() => this.propsNavigation(child, this.state.data)} key={`panelChildren${child.name}${index}${this.state.title}`}>
              <Text style={styles.title}>{child.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    margin: 10,
    overflow: 'hidden'
  },
  titleContainer: {
    flexDirection: 'row'
  },
  title: {
    flex: 1,
    padding: 10,
    color: '#2a2f43',
    fontFamily: 'Quicksand-Bold'
  },
  buttonImage: {
    width: 30,
    height: 25
  },
  body: {
    padding: 10,
    paddingTop: 0
  },
  children: {
    color: '#2a2f43',
    paddingLeft: 10,
    fontFamily: 'Quicksand-Bold'
  }
})
