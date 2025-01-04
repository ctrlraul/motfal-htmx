'use strict';

;(() => {

	const data = JSON.parse(document.getElementById('data').textContent);
	const inviteLink = location.origin + '/join/' + data.roomId;
	const updateTimeIntervalMs = 5000;


	if (data.isGuesser)
	{
		const inviteLinkOutput = document.getElementById('invite-link');
		inviteLinkOutput.value = inviteLink;

		const copyInviteButton = document.getElementById('copy-invite-button');
		copyInviteButton.addEventListener('click', copyInviteToClipboard);
	}

	updateTime();


	function updateTime()
	{
		const span = document.getElementById('time');

		if (span)
		{
			span.textContent = timeAgo(data.roomCreationTime);
			setTimeout(updateTime, updateTimeIntervalMs);
		}
	}

	function timeAgo(unixTimestampMs) {

		const now = Date.now();
		const differenceInSeconds = Math.floor((now - unixTimestampMs) / 1000);

		if (differenceInSeconds < 60 * 2)
			return `${differenceInSeconds} seconds ago`;

		const differenceInMinutes = Math.floor(differenceInSeconds / 60);
		if (differenceInMinutes < 60 * 2)
			return `${differenceInMinutes} minutes ago`;

		const differenceInHours = Math.floor(differenceInMinutes / 60);
		if (differenceInHours < 24 * 2)
			return `${differenceInHours} hours ago`;

		const differenceInDays = Math.floor(differenceInHours / 24);
		return `${differenceInDays} days ago`;
	}

	function copyInviteToClipboard(_event) {
		navigator.clipboard.writeText(inviteLink)
			.then(() => console.log('Copied to clipboard'))
			.catch(error => console.error('Failed to copy to clipboard:', error));
	}

})();