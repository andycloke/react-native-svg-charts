import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Animated, Easing, StyleSheet, View } from 'react-native'
import { Constants } from './util'
import BarChartComponent from './horizontal-labeled-bar-chart-component'

class HorizontalLabeledBarChart extends PureComponent {

    completedLayouts = 0

    constructor(props) {
        super(props)

        this._resetAnimations(props.dataPoints)
    }

    _resetAnimations(dataPoints) {
        this.animations = dataPoints.map(obj => new Animated.Value(300 * -Math.sign(obj.value)))
    }

    componentWillReceiveProps(props) {
        if (props.dataPoints !== this.props.dataPoints) {
            this._resetAnimations(props.dataPoints)
            this._animate()
        }
    }

    componentDidMount() {
        this._animate()
    }

    _animate() {
        Animated.parallel(
            this.animations.map(animation =>
                Animated.timing(animation, {
                    toValue: 0,
                    easing: Easing.bounce,
                    duration: this.props.animationDuration,
                    useNativeDriver: true,
                }),
            ),
        ).start()
    }

    render() {
        const {
                  style,
                  dataPoints,
                  barStyle,
              } = this.props

        const negativeValues = dataPoints.filter(obj => obj.value < 0)
        const positiveValues = dataPoints.filter(obj => obj.value >= 0)

        const maxValue = Math.max(...dataPoints.map(obj => Math.abs(obj.value)))
        const ratios   = dataPoints.map(obj => Math.abs(obj.value / maxValue))

        const hasDifferentSigns = negativeValues.length > 0 && positiveValues.length > 0

        return (
            <View style={style}>
                <BarChartComponent
                    ratios={ratios}
                    hasDifferentSigns={hasDifferentSigns}
                    animations={this.animations}
                    barStyle={[ barStyle, styles.bar ]}
                    {...this.props}
                />
            </View>
        )
    }
}

HorizontalLabeledBarChart.propTypes = {
    dataPoints: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string.isRequired,
        color: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
        renderValue: PropTypes.func,
        renderLabel: PropTypes.func,
    })).isRequired,
    style: PropTypes.any,
    barStyle: PropTypes.any,
    spacing: PropTypes.number,
    animationDuration: PropTypes.number,
}

HorizontalLabeledBarChart.defaultProps = {
    spacing: 4,
    animationDuration: 1000,
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bar: {
        borderRadius: 5,
        height: 10,
    },
    grid: Constants.gridStyle,
    surface: {
        backgroundColor: 'transparent',
    },
})

export default HorizontalLabeledBarChart
