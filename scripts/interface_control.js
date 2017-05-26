$(function() {
	var playedAlready = false; 
	var playedAlreadyObj = undefined;
	$(document).on("click", ".audioMiniBlock", function() {
		$(this).parent().find(".audioPlay").trigger("click");
	});

	// Управление воспроизведением
	var playedAlready = false;
	var playedAlreadyBlock = undefined;
	$(document).on("click", ".audioPlay", function() {

		var pausePlay = function(player) {
			playedAlready = false;
			$(player).find("audio")[0].pause();
			$(player).find(".audioImg").addClass("notPlayed").removeClass("played");
		};
		var goPlay = function(player) {
			playedAlready = true;
			playedAlreadyBlock = player;
			$(player).find("audio")[0].play();
			$(player).find(".audioImg").addClass("played").removeClass("notPlayed");
			$(player).find("audio")[0].onended = () => {stopPlay(player);}
		};
		var stopPlay = (player) => {
			pausePlay(player);
			$(player).find("audio")[0].currentTime = 0;
		}

		if (typeof playedAlreadyBlock == 'undefined' || playedAlreadyBlock != $(this).parent()[0]) {
			if (typeof playedAlreadyBlock != 'undefined') stopPlay(playedAlreadyBlock);
			goPlay($(this).parent()[0]);
		} else if (playedAlready && playedAlreadyBlock == $(this).parent()[0]) {
			pausePlay($(this).parent()[0]);
		} else {
			goPlay($(this).parent()[0]);
		}
	});
	// Конец управления воспроизведением

	$(document).on("click", ".addAudio", function() {
		if ($(".addAudio div").hasClass('plus')) {
			$(".addAudio div").html('-');
		} else {
			$(".addAudio div").html('+');
		}
		$("#screenBlocker").toggle();
		$("#upload").toggle();
		$(".addAudio div").toggleClass('plus minus');
		$(".addAudio").toggleClass('green red');
	});
	$(document).on("click", ".cancelEdit", function() {
		$("#screenBlocker").toggle();
		$("#editAudio").toggle();
		$(".addAudio").toggle();
	});
	$(document).on("click", ".addImageFile", function() {
		$("#upload input[type=file]#f1").trigger("click");
	});
	$(document).on("click", ".addAudioFile", function() {
		$("#upload input[type=file]#f2").trigger("click");
	});
	$(document).on("click", ".audioEdit", function() {
		let parent = $(this).parents()[1];
		$("#editAudio input[type=text]").val($(parent).find(".audioTitle").html());
		$("#editAudio textarea").text($(parent).find(".audioDescr").html());
		$("#delAudioLink").attr("href", "/del/"+$(parent).find(".textBox").attr("name"));
		$(".idAudio").val($(parent).find(".textBox").attr("name"));
		$("#screenBlocker").toggle();
		$("#editAudio").toggle();
		$(".addAudio").toggle();
	});
	$(document).on("mouseover", ".audioMainBlock", function() {
		$(this).find(".audioEdit").css("display", "block");
	});
	$(document).on("mouseout", ".audioMainBlock", function() {
		$(this).find(".audioEdit").css("display", "none");
	});
});