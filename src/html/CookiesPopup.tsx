import { jsx } from 'jsx';

export function CookiesPopup()
{
	return (
		<div id='cookiesPopup'>
			<div class='g-box-pop g-foreground'>
				<span>
					Hi there! We only use cookies that are essential for the site to function—nothing extra. Thanks for visiting!
				</span>

				<div class='buttons'>
					<button hx-post='/cookies/accept'
						hx-target='#cookiesPopup'
						hx-swap='outerHTML'>
						Accept
					</button>

					<div class='spacer'></div>

					<button hx-post='/cookies/reject'>
						Reject
					</button>
				</div>
			</div>
		</div>
	);
}