/* VARIABLES THROUGHOUT THE APP */
let modalText = '',
    passd = true,
    played = false,
    audio1 = new Audio('audio/slide_1.mp3'),
    audio2 = new Audio('audio/slide_20.mp3'),
    audio3 = new Audio('audio/slide_21.mp3'),
    // JSON DATA FILE
    dataApp = {
        'modal_title_right': '<h2>¡Muy Bien!</h2>',
        'modal_title_wrong': '<h2>¡Ojo!</h2>',
        'modal_text_right': '<p>Has logrado identificar muy bien el problema.<br>Continúa con la segunda fase del ejercicio.</p>',
        'modal_text_wrong': '<p>La opción seleccionada no es la correcta:<br>Este problema no está bien planteado<br>y no da referencias concretas.</p>',
    };

/* PLAY AUDIO FUNCTIONS */
function playAudio(audioFile) {
    /* INITIALIZE ALL AUDIOS FIRST */
    initializeAudioFiles(); 

    var playPromise = audioFile.play();
    playPromise.catch(error => {
        audioFile.play();
    });
    audioFile.play();
}

function initializeAudioFiles() {
    audio1.pause();
    audio1.currentTime = 0;
    audio2.pause();
    audio2.currentTime = 0;
    audio3.pause();
    audio3.currentTime = 0;
}

/* TOGGLE MODAL FUNCTION */
function toggleModal(action) {
    if (action == 'open') {
        jQuery('.modal').animate({
            zIndex: '100',
            opacity: '+=1'
        }, 120);
    } else {
        jQuery('.modal').animate({
            zIndex: '-2',
            opacity: '0'
        }, 50);
    }
}

/* CHECK IF ALL DRAGGABLE ARE IN POSITION */
function checkAccepted() {
    jQuery('.dropbox').each(function(i) {
        passd = true;
        if (!jQuery(this).hasClass('ui-state-highlight')) {
            passd = false;
        }
    });

    if (passd == true) {
        jQuery('.text-title-step2').addClass('element-hidden');
        jQuery('.text-correct-answer').removeClass('element-hidden');
        // PLAY AUDIO
        playAudio(audio3);
    }
}

/* --------------------------------------------------------------
    MAIN READY FUNCTION
-------------------------------------------------------------- */
jQuery(document).ready(function(e) {
    console.log('Functions Loaded');
    /* --------------------------------------------------------------
    SECTION 1 - FUNCTIONS + ACTIONS
    -------------------------------------------------------------- */

    // trigger initial action for audio -- not working
    jQuery(document).trigger('click');
    /* INITIAL ACTION - NOT WORKING  */
    jQuery(document).on('click', function(e) {
        if (played == false) {
            playAudio(audio1);
            played = true;
        }
    });

    // ANIMATE INITIAL BOX
    jQuery('.text-title').animate({
        left: '0',
        opacity: '+=1'
    }, 500, function(e) {
        // ANIMATE RESPONSES
        jQuery('.form-item-group-1').animate({
            opacity: '+=1'
        }, 50);

        jQuery('.form-item-group-2').animate({
            opacity: '+=1'
        }, 100);
    });

    /* TOGGLE SELECTION AND SHOW NEXT BUTTON */
    jQuery('.form-item-group').on('click', function(e) {
        e.preventDefault();
        jQuery('.form-item-group').each(function() {
            jQuery(this).removeClass('form-item-selected');
            jQuery(this).children('input').removeAttr('checked');
        });
        jQuery(this).addClass('form-item-selected');
        jQuery(this).children('input').attr('checked', 'checked');

        jQuery('.btn-section1').removeClass('element-hidden');
        jQuery('.btn-section1').animate({
            opacity: '+=1',
        }, 100);
    });

    /* MODAL CLOSE */
    jQuery('.modal-close').on('click', function(e) {
        e.preventDefault();

        // CLOSE MODAL
        toggleModal('close');

        var selected = jQuery('input[name="selection1"]:checked').val();

        if (selected == 'opcion1') {
            jQuery('.section-content-step1').addClass('element-hidden');
            jQuery('.section-content-step2').removeClass('element-hidden');

            // PLAY AUDIO
            playAudio(audio2);
        } else {
            jQuery('.form-item-group').each(function() {
                jQuery(this).removeClass('form-item-selected');
                jQuery(this).children('input').removeAttr('checked');
            });
            jQuery('.btn-section1').css('opacity', '0');
            jQuery('.btn-section1').removeClass('element-hidden');
        }
    });

    /* MODAL BACK BUTTON IF ANSWER IS WRONG */
    jQuery('.modal-back').on('click', function(e) {
        e.preventDefault();

        // CLOSE MODAL
        toggleModal('close');

        var selected = jQuery('input[name="selection1"]:checked').val();

        if (selected == 'opcion1') {
            jQuery('.section-content-step1').addClass('element-hidden');
            jQuery('.section-content-step2').removeClass('element-hidden');
        } else {
            jQuery('.form-item-group').each(function() {
                jQuery(this).removeClass('form-item-selected');
                jQuery(this).children('input').removeAttr('checked');
            });
            jQuery('.btn-section1').css('opacity', '0');
            jQuery('.btn-section1').removeClass('element-hidden');
        }
    });

    /* CHANGE TO SECTION 2 */
    jQuery('.btn-section1').click(function(e) {
        e.preventDefault();

        // OPEN MODAL
        toggleModal('open');

        // VALIDATE PREVIOUS RESPONSE
        if (jQuery('input[name="selection1"]:checked').val() == 'opcion1') {
            modalText = dataApp.modal_title_right + dataApp.modal_text_right;
            jQuery('.modal-text').removeClass('text-danger');
            jQuery('.modal-text').addClass('text-success');
            jQuery('.modal-back-container').addClass('element-hidden');
        } else {
            modalText = dataApp.modal_title_wrong + dataApp.modal_text_wrong;
            jQuery('.modal-text').removeClass('text-success');
            jQuery('.modal-text').addClass('text-danger');
            jQuery('.modal-back-container').removeClass('element-hidden');
        }

        jQuery('.modal-text').html(modalText);
    });


    /* --------------------------------------------------------------
    SECTION 2 - FUNCTIONS + ACTIONS
    -------------------------------------------------------------- */
    // INITIALIZE ALL DRAGGABLES
    jQuery('.dragbox').each(function() {
        jQuery(this).draggable({
            snap: true,
            snapMode: 'inner',
            revert: 'invalid'
        });
    });

    // INITIALIZE ALL DROPABLES AND READ ACTION RESPONSE
    jQuery('.dropbox').each(function(i) {
        jQuery(this).droppable({
            accept: '#draggableOpt' + (i + 1),
            drop: function(event, ui) {
                ui.draggable.position({
                    my: "center",
                    at: "center",
                    of: jQuery(this),
                    using: function(pos) {
                        jQuery(this).animate(pos, 200, "linear");
                    }
                });
                ui.draggable.draggable('disable');
                jQuery(this).addClass("ui-state-highlight");
                checkAccepted();
            }
        });
    });

    // GO BACK BUTTON FUNCTION
    jQuery('.btn-section2').click(function(e) {
        e.preventDefault();

        jQuery('.section-content-step1').removeClass('element-hidden');
        jQuery('.section-content-step2').addClass('element-hidden');
        jQuery('.form-item-group').each(function() {
            jQuery(this).removeClass('form-item-selected');
            jQuery(this).children('input').removeAttr('checked');
        });
        jQuery('.btn-section1').css('opacity', '0');
        jQuery('.btn-section1').removeClass('element-hidden');

        // PLAY PREVIOUS AUDIO
        playAudio(audio1);
    });
});