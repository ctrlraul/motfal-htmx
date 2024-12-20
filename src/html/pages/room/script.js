'use strict';

;(() => {

	const dataElement = document.getElementById('data');
	const data = JSON.parse(dataElement.textContent);
	const inviteLink = location.origin + '/join/' + data.room.id;
	const updateTimeIntervalMs = 5000;


	dataElement.remove();

	if (data.userId == data.room.guesserId)
	{
		const inviteLinkOutput = document.getElementById('invite-link');
		inviteLinkOutput.value = inviteLink;

		const copyInviteButton = document.getElementById('copy-invite-button');
		copyInviteButton.addEventListener('click', () => copyToClipboard(inviteLink));
	}

	updateTime();


	function updateTime()
	{
		const span = document.getElementById('time');

		if (span)
		{
			span.textContent = timeAgo(data.room.creationTime);
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

	async function copyToClipboard(text) {
		try {
			await navigator.clipboard.writeText(text);
			console.log('Copied to clipboard');
		} catch (error) {
			console.error('Failed to copy to clipboard:', error);
		}
	}

})();