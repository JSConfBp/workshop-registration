import React from 'react'
import App from 'next/app'
import Head from 'next/head'
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../theme';

//import { wrapWithAuth } from '../components/Auth'
import Route from '../components/Route'
import routing from '../routing'

class MyApp extends App {

	componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }

	render () {
		const { Component, pageProps } = this.props

	  return <>
			<Head>
				<title>Workshop Registration - JSConf Budapest 2019</title>
			</Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
					<Route.Provider value={routing()}>
						<Component pageContext={this.pageContext} {...pageProps} />
					</Route.Provider>
        </ThemeProvider>
		</>
	}
}
export default MyApp
//export default wrapWithAuth(MyApp)
