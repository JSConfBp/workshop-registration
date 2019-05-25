import React from 'react'
import App, { Container } from 'next/app'
import Head from 'next/head'
import { MuiThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import JssProvider from 'react-jss/lib/JssProvider'
import getPageContext from '../lib/getPageContext';

//import { wrapWithAuth } from '../components/Auth'
import Route from '../components/Route'
import routing from '../routing'

class MyApp extends App {

	constructor() {
    super()
    this.pageContext = getPageContext()
	}

	componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

	static async getInitialProps ({ Component, ctx }) {
	  return {
			pageProps: (Component.getInitialProps ? await Component.getInitialProps(ctx) : {})
	  }
	}

	render () {
		const { Component, pageProps } = this.props

	  return <Container>
			<Head>
				<title>Workshop Registration - JSConf Budapest 2019</title>
			</Head>
			{/* Wrap every page in Jss and Theme providers */}
			<JssProvider
          registry={this.pageContext.sheetsRegistry}
          generateClassName={this.pageContext.generateClassName}
			>
				{/* MuiThemeProvider makes the theme available down the React
					tree thanks to React context. */}
				<MuiThemeProvider
					theme={this.pageContext.theme}
					sheetsManager={this.pageContext.sheetsManager}
				>
					{/* CssBaseline kickstart an elegant, consistent,
						and simple baseline to build upon. */}
					<CssBaseline />
					<Route.Provider value={routing()}>
						{/* Pass pageContext to the _document though the renderPage enhancer
							to render collected styles on server-side. */}
						<Component pageContext={this.pageContext} {...pageProps} />
					</Route.Provider>
				</MuiThemeProvider>
			</JssProvider>
		</Container>
	}
}
export default MyApp
//export default wrapWithAuth(MyApp)