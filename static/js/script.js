$(document).ready(function(){

    /* Display confirmation modal with dynamic confirm button
    Code from: https://getbootstrap.com/docs/5.0/components/modal/#varying-modal-content */

    let confirmationModal = document.getElementById('modal-confirm');
    confirmationModal.addEventListener('show.bs.modal', function (event) {

        // Button that triggered the modal
        let button = event.relatedTarget;

        // Extract info from data-bs attributes
        let url = button.getAttribute('data-bs-url');
        let text = button.getAttribute('data-bs-text');

        // Update the modal's text content
        let modalText = confirmationModal.querySelector('.modal-text');
        modalText.innerHTML = `<strong class="text-danger"><i class="bi bi-exclamation-circle-fill" aria-hidden="true"> </i>${ text }</strong>`;

        // Update the modal's button content
        let modalConfirm = confirmationModal.querySelector('.btn-confirm');
        modalConfirm.href = url;

    });

    /* Date-and-time pickers using flatpickr plugin
    Code from: https://flatpickr.js.org/examples */

    $(".showtime").flatpickr({
        enableTime: true,
        dateFormat: "d-m-Y H:i",
        minDate: event_start,
        maxDate: event_end
    });

    $(".event-date").flatpickr({
        dateFormat: "d-m-Y",
        minDate: "01-07-2022",
    });

    /* Event listener for flip-card function */

    $("#lineup-bios").on("click", ".flip-card", function(e) {
        if($(e.target).is("a")) {
            return true;
        } else { this.classList.toggle("flipped"); }
    });

    /* Prevent overlapping images in Masonry layout using imagesLoaded script
    Code from: https://masonry.desandro.com/layout#imagesloaded */ 

    let $grid = $('.masonry-row').masonry({
        itemSelector: '.flip-card',
        percentPosition: true
      });
        
    $grid.imagesLoaded().progress( function() {
        $grid.masonry('layout');
      });
    
        const countdownDiv = document.getElementById("countdown");
        const nowNextDiv = document.getElementById("now-next");
        const eventStartDate = new Date("July 11, 2024 18:01:00");
      
        function updateCountdown() {
            let now = new Date();
            let nowCalc = new Date();
            
            // Lines below allow testing of now and next ahead of time
            // now.setDate(now.getDate() + 7);
            // nowCalc.setDate(nowCalc.getDate() + 7);
       
        let diff = eventStartDate - now;
      
        let days = Math.floor(diff / (1000 * 60 * 60 * 24));
        let hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
        if (diff <= 0) {
         
            now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
            now = now.toISOString();
        
            let stages = {};
            for (let showtime of festivalData) {
            let stage = showtime.showtime_stage;
            if (!stages[stage]) {
                stages[stage] = [];
            }
            stages[stage].push(showtime);
            }
        
            for (let [stage, shows] of Object.entries(stages)) {
            let nowShows = shows.filter(show => now >= show.showtime_start && now < show.showtime_end);
            let nextShow = shows.find(show => now < show.showtime_start);
        
            let nowElement = document.getElementById(`now-${stage}`);
            let nextElement = document.getElementById(`next-${stage}`);
        
            if (nowShows.length > 0) {
                let nowShow = nowShows[0];
                let endShow = new Date (nowShow.showtime_end);
                let timeRemain = Math.floor((endShow - nowCalc) / (1000 * 60)) + 1;
                nowElement.innerHTML = `<strong>Now:</strong> ${nowShow.showtime_artist} <small>(${timeRemain} min left)</small>`;
            } else {
                nowElement.innerHTML = `<strong>Now:</strong> No current performance`;
            }
        
            if (nextShow) {
                let startShow = new Date (nextShow.showtime_start);
                let timeUntil = Math.floor((startShow - nowCalc) / (1000 * 60)) + 1;
                nextElement.innerHTML = `<strong>Next:</strong> ${nextShow.showtime_artist} <small>(in ${timeUntil} min)</small>`;
            } else {
                nextElement.innerHTML = `<strong>Next:</strong> No upcoming performance`;
            }
            }
        
            countdownDiv.classList.add("hidden");
            nowNextDiv.classList.remove("hidden");
      
        } else {
      
        countdownDiv.innerHTML = `
        <h2 class="mt-2">The Final Countdown!</h2>
        <p>There are just <strong>${days} days, ${hours} hours and ${minutes} minutes</strong> left until FotL 2024... We can't wait to see you again!</p>`; 
       
        nowNextDiv.hidden = true;
      
        }
        }
      
        updateCountdown();
        setInterval(updateCountdown, 10000);

});