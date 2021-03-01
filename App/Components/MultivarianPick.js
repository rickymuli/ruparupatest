import React, { Component } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import isEmpty from 'lodash/isEmpty'
import map from 'lodash/map'
import get from 'lodash/get'
import styles from './Styles/PDPStyles'
import { fonts } from '../Styles'
import { connect } from 'react-redux'
import { WithContext } from '../Context/CustomContext'

class MultivarianPick extends Component {
  constructor (props) {
    super(props)
    this.state = {
      activeColor: '',
      activeSize: ''
    }
  }

  changeColor = (color) => {
    this.setState({ activeColor: color }, () => {
      this.getSkuMultivariants()
    })
  }

  changeSize = (size) => {
    this.setState({ activeSize: size }, () => {
      this.getSkuMultivariants()
    })
  }

  componentDidMount () {
    this.setSizeColor()
  }

  componentDidUpdate (prevProps, prevState) {
    const { payload } = this.props
    if (prevProps.payload !== payload) {
      this.setSizeColor()
    }
  }

  setSizeColor () {
    const { payload } = this.props
    let activeColor, activeSize
    map(get(payload, 'multivariants.attributes.names'), (name) => {
      payload.multivariants.attributes.possible_combinations[name].map((field) => {
        if (payload.multivariants.component_rendering_rule[name + '~' + field].selected) {
          if (name === 'color') activeColor = name + '~' + field
          else activeSize = name + '~' + field
        }
      })
    })
    this.setState({ activeColor, activeSize })
  }

    getSkuMultivariants = () => {
      const { payload, setParentState } = this.props
      const { activeColor, activeSize } = this.state
      const multivariants = payload.multivariants
      let isThereCombination = false
      multivariants.variants_structure.combinations.map((combination, index) => {
        if (combination.length > 1) {
          if (combination[0] === activeColor && combination[1] === activeSize) {
            setParentState({ activeVariant: payload.variants[index] })
            isThereCombination = true
          }
        } else {
          if (combination[0] === activeColor || combination[0] === activeSize) {
            setParentState({ activeVariant: payload.variants[index] })
          }
          isThereCombination = true
        }
      })
      if (isThereCombination === false) {
        this.setState({ activeSize: multivariants.render_rule[activeColor][0] }, () => {
          this.getSkuMultivariants()
        })
      }
    }

    renderColor = (name, color, index) => {
      const { payload: product } = this.props
      const { activeColor } = this.state
      const hexColor = product.multivariants.attributes.extra_information[name + '~' + color]
      const active = product.multivariants.component_rendering_rule[name + '~' + color].active
      if (active) {
        return (
          <TouchableOpacity key={`color ${index}${hexColor}`}>
            <View style={{ backgroundColor: hexColor, width: 25, height: 25, borderRadius: 3, marginRight: 15, justifyContent: 'center', alignItems: 'center' }}>
              <Icon name='check' color='white' />
            </View>
          </TouchableOpacity>
        )
      } else if (activeColor === '') {
        return (
          <TouchableOpacity key={`color ${index}${hexColor}`} onPress={() => this.changeColor(name + `~` + color)}>
            <View style={{ backgroundColor: hexColor, width: 25, height: 25, borderRadius: 3, marginRight: 15 }} />
          </TouchableOpacity>
        )
      } else {
        return null
      }
    }

    renderSize = (name, size, index) => {
      const { payload } = this.props
      const { activeSize, activeColor } = this.state
      const multivariants = payload.multivariants
      let found = ''
      let active = false
      if (!isEmpty(activeColor)) {
        if (multivariants.component_rendering_rule[activeColor].next_sequence && multivariants.component_rendering_rule[activeColor].next_sequence.length > 0) {
          found = multivariants.component_rendering_rule[activeColor].next_sequence.find(attribute => attribute === name + '~' + size)
        }
        active = multivariants.component_rendering_rule[name + '~' + size].active
      }
      if (activeSize === name + '~' + size) {
        if (typeof found !== 'undefined' && !isEmpty(activeColor) && active) {
          return (
            <TouchableOpacity key={`size ${index} ${size}`} onPress={() => this.changeSize(name + '~' + size)}>
              <View style={styles.selectedButton}>
                <Text style={{ color: 'white', fontFamily: fonts.regular }}>{size}</Text>
                <Icon name='check' color='white' />
              </View>
            </TouchableOpacity>
          )
        } else {
          return (
            <View style={styles.disabledButton} key={`size ${index} ${size}`}>
              <Text style={{ color: 'white', fontFamily: fonts.regular }}>{size}</Text>
              <Icon name='check' color='white' />
            </View>
          )
        }
      } else {
        if (typeof found !== 'undefined' && activeColor !== '' && active) {
          return (
            <TouchableOpacity key={`size ${index} ${size}`} onPress={() => this.changeSize(name + '~' + size)}>
              <View style={styles.button}>
                <Text style={{ color: '#777A88', fontFamily: fonts.regular }}>{size}</Text>
              </View>
            </TouchableOpacity>
          )
        } else {
          return (
            <View style={styles.disabledButton} key={`size ${index} ${size}`}>
              <Text style={{ color: '#777A88', fontFamily: fonts.regular }}>{size}</Text>
            </View>
          )
        }
      }
    }

    render () {
      const { payload } = this.props
      return (
        <View>
          {map(get(payload.multivariants, 'attributes.names'), (name, index) =>
            <View key={`${name} variant ${index}`}>
              {name === 'color'
                ? <>
                  <Text style={{ fontFamily: fonts.regular }}>Pilih Warna</Text>
                  <View style={{ marginBottom: 10, paddingTop: 5, flexDirection: 'row', flexWrap: 'wrap' }}>
                    {payload.multivariants.attributes.possible_combinations[name].map((color, index) => this.renderColor(name, color, index))}
                  </View>
                  </>
                : <>
                  <Text style={{ fontFamily: fonts.regular }}>Pilih Ukuran</Text>
                  <View style={{ marginBottom: 10, paddingTop: 5, flexDirection: 'column' }}>
                    {payload.multivariants.attributes.possible_combinations[name].map((size, index) => this.renderSize(name, size, index))}
                  </View>
                  </>
              }
            </View>
          )}
        </View>
      )
    }
}

const mapStateToProps = (state) => ({
  misc: state.misc
})

export default WithContext(connect(mapStateToProps, null)(MultivarianPick))
