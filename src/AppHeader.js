import React from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import * as types from './constants'

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },

  body: {
    marginLeft: 45,
    marginRight: 45
  }
};

export default class AppHeader extends React.Component {
  handleChange = (val) => {
    const value = this.props.value === val ? '' : val
    this.props.onSelectTab(value)
  }

  render() {
    return (
      <Tabs value={this.props.value}>
        <Tab label="Genetic Algorithm" value={types.GENETIC} onClick={this.handleChange.bind(null, types.GENETIC)} >
          <div style={styles.body}>
            <h2 style={styles.headline}>Genetic Algorithm</h2>
            <p>
              A genetic algorithm (GA) is a method for solving both constrained and unconstrained optimization problems
              based on a natural selection process that mimics biological evolution. The algorithm repeatedly modifies
              a population of individual solutions. At each step, the genetic algorithm randomly selects individuals
              from the current population and uses them as parents to produce the children for the next generation.
              Over successive generations, the population "evolves" toward an optimal solution.
            </p>
          </div>
        </Tab>
        <Tab label="Simulated Annealing" value={types.SIMULATED_ANNEALING} onClick={this.handleChange.bind(null, types.SIMULATED_ANNEALING)}>
          <div style={styles.body}>
            <h2 style={styles.headline}>Simulated Annealing</h2>
            <p>
              Simulated annealing (SA) is a probabilistic technique for approximating the global optimum of a given
              function. Specifically, it is a metaheuristic to approximate global optimization in a large search space.
              It is often used when the search space is discrete (e.g., all tours that visit a given set of cities).
              For problems where finding an approximate global optimum is more important than finding a precise local
              optimum in a fixed amount of time, simulated annealing may be preferable to alternatives such as gradient
              descent.
            </p>
          </div>
        </Tab>
        <Tab label="Brute Force Algorithm" value={types.BRUTE_FORCE} onClick={this.handleChange.bind(null, types.BRUTE_FORCE)}>
          <div style={styles.body}>
            <h2 style={styles.headline}>Brute Force Algorithm</h2>
            <p>
              This algorithm tries every single possible route to find the best route for the salesman. Because it is
              so expensive in terms of DOM re-rendering, the max number of points is limited to 10 to prevent browser crashes.
            </p>
          </div>
        </Tab>
      </Tabs>
    )
  }
}