(async function()
{
	const paired_devices = await analogsense.getDevices();
	if (paired_devices.length != 0)
	{
		window.dev = paired_devices[0];
		initDevice();
	}

	window.onclick = window.onkeydown = async function(event)
	{
		if (!window.dev)
		{
			window.dev = await analogsense.requestDevice();
			if (window.dev)
			{
				initDevice();
			}
		}
	};
})();

function time()
{
	return Date.now() / 1000;
}

let full_press_since = 0;
let max_frame = 6;
let zero_since = 0;

function initDevice()
{
	document.querySelector("img").src = "images/laser.png";
	window.dev.startListening(function(active_keys)
	{
		let value = 0;
		for (const key of active_keys)
		{
			if (key.value > value)
			{
				value = key.value;
			}
		}

		const frame = parseInt(value * max_frame);
		if (frame == max_frame)
		{
			if (full_press_since == 0)
			{
				document.querySelector("img").src = "images/press" + frame + ".png";
				full_press_since = time();
			}
		}
		else
		{
			document.querySelector("img").src = "images/press" + frame + ".png";
			full_press_since = 0;
		}

		if (value == 0)
		{
			max_frame = 6;
			zero_since = time();
		}
		else
		{
			zero_since = 0;
		}
	});
}

window.setInterval(function()
{
	if (full_press_since != 0)	
	{
		if (max_frame != 8)
		{
			if ((time() - full_press_since) > 0.15)
			{
				max_frame++;
				full_press_since = time();
				document.querySelector("img").src = "images/press" + max_frame + ".png";
			}
		}
	}

	if (zero_since != 0)
	{
		if ((time() - zero_since) > 20.5)
		{
			document.querySelector("img").src = "images/neutral.png"; // 5 - Acceptable
		}
		else if ((time() - zero_since) > 15.5)
		{
			document.querySelector("img").src = "images/cry.png"; // 4 - Depression
		}
		else if ((time() - zero_since) > 10.5)
		{
			document.querySelector("img").src = "images/think.png"; // 3 - Bargaining
		}
		else if ((time() - zero_since) > 5.5)
		{
			document.querySelector("img").src = "images/knife.png"; // 2 - Anger
		}
		else if ((time() - zero_since) > 0.5)
		{
			document.querySelector("img").src = "images/sweating.png"; // 1 - Denial
		}
	}
}, 100);
