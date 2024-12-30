import { jsx } from 'jsx';
import { CookiesPopup } from '@html/CookiesPopup.tsx';
import { User } from '../data/user.ts';

export interface RootProps {
	title: string;
	children?: unknown;
	user: User;
}

export function Root(props: RootProps) {
	return (
		<html lang='en'>
			<head>
				<meta charset='UTF-8'/>
				<meta name='viewport' content='width=device-width, initial-scale=1.0'/>
				
				<title>{props.title}</title>

				<link rel='icon' type='image/svg' href='images/branding/logo-x64.svg' />

				<link rel='stylesheet' href='global.css'/>

				<script src='https://unpkg.com/htmx.org@2.0.4'></script>
				<script src='https://unpkg.com/htmx-ext-sse@2.2.2/sse.js'></script>
			</head>
			<body hx-ext='sse' sse-connect='/sse'>
				<div id='root'>
					<div class='g-content-width'>
						{props.children}
					</div>
				</div>
				
				{props.user.acceptedCookies ? '' : (
					<CookiesPopup />
				)}
			</body>
		</html>	
	)
}