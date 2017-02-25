import { connect } from 'react-redux'
import Canvas from './Canvas'

const mapStateToProps = (state, ownProps) => {
  return Object.assign({}, ownProps, {
    selectedAlgorithm: state.getIn(['selectedAlgorithm']),
    canvasWidth: 660,
    canvasHeight: 440
  })
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  }
}

const CanvasContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Canvas)

export default CanvasContainer