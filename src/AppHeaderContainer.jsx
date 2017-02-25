import { connect } from 'react-redux'
import AppHeader from './AppHeader'
import { setSelectedTab } from './actions'

const mapStateToProps = (state, ownProps) => {
  return Object.assign({}, ownProps, {
    value: state.getIn(['selectedAlgorithm'])
  })
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onSelectTab: (value) => {
      dispatch(setSelectedTab(value))
    }
  }
}

const CanvasContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AppHeader)

export default CanvasContainer