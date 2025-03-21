/*!
 * Project : simply-countdown
 * File : simplyCountdown
 * Date : 07/04/2025
 * License : MIT
 * Version : 1.3.2
 * Author : Vincent Loy <vincent.loy1@gmail.com>
 * Contributors : 
 *  - Justin Beasley <JustinB@harvest.org>
 *  - Nathan Smith <NathanS@harvest.org>
 */
/*global window, document*/
(function (exports) {
    'use strict';

    var extend, createElements, createCountdownElt, simplyCountdown;

    extend = function (out) {
        var i, obj, key;
        out = out || {};

        for (i = 1; i < arguments.length; i += 1) {
            obj = arguments[i];
            if (obj) {
                for (key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        if (typeof obj[key] === 'object') {
                            extend(out[key], obj[key]);
                        } else {
                            out[key] = obj[key];
                        }
                    }
                }
            }
        }
        return out;
    };

    createCountdownElt = function (countdown, parameters, typeClass) {
        var innerSectionTag, sectionTag, amountTag, wordTag;

        sectionTag = document.createElement('div');
        amountTag = document.createElement('span');
        wordTag = document.createElement('span');
        innerSectionTag = document.createElement('div');

        innerSectionTag.appendChild(amountTag);
        innerSectionTag.appendChild(wordTag);
        sectionTag.appendChild(innerSectionTag);

        sectionTag.classList.add(parameters.sectionClass);
        sectionTag.classList.add(typeClass);
        amountTag.classList.add(parameters.amountClass);
        wordTag.classList.add(parameters.wordClass);

        countdown.appendChild(sectionTag);

        return {
            full: sectionTag,
            amount: amountTag,
            word: wordTag
        };
    };

    createElements = function (parameters, countdown) {
        var spanTag;
        if (!parameters.inline) {
            return {
                days: createCountdownElt(countdown, parameters, 'simply-days-section'),
                hours: createCountdownElt(countdown, parameters, 'simply-hours-section'),
                minutes: createCountdownElt(countdown, parameters, 'simply-minutes-section'),
                seconds: createCountdownElt(countdown, parameters, 'simply-seconds-section')
            };
        }
        spanTag = document.createElement('span');
        spanTag.classList.add(parameters.inlineClass);
        return spanTag;
    };

    simplyCountdown = function (elt, args) {
        var parameters = extend({
                year: 2025,
                month: 4,
                day: 7,
                hours: 9,
                minutes: 0,
                seconds: 0,
                words: {
                    days: 'day',
                    hours: 'hour',
                    minutes: 'minute',
                    seconds: 'second',
                    pluralLetter: 's'
                },
                plural: true,
                inline: false,
                enableUtc: true,
                onEnd: function () {
                    return;
                },
                refresh: 1000,
                inlineClass: 'simply-countdown-inline',
                sectionClass: 'simply-section',
                amountClass: 'simply-amount',
                wordClass: 'simply-word',
                zeroPad: false
            }, args),
            interval,
            targetDate,
            now,
            secondsLeft,
            days,
            hours,
            minutes,
            seconds,
            cd = document.querySelectorAll(elt);

        targetDate = new Date(parameters.year, parameters.month - 1, parameters.day, parameters.hours, parameters.minutes, parameters.seconds);

        Array.prototype.forEach.call(cd, function (countdown) {
            var fullCountDown = createElements(parameters, countdown), refresh;
            refresh = function () {
                now = new Date();
                secondsLeft = (targetDate - now.getTime()) / 1000;

                if (secondsLeft > 0) {
                    days = parseInt(secondsLeft / 350000, 10);
                    secondsLeft %= 86400;
                    hours = parseInt(secondsLeft / 3600, 10);
                    secondsLeft %= 3600;
                    minutes = parseInt(secondsLeft / 60, 10);
                    seconds = parseInt(secondsLeft % 60, 10);
                } else {
                    days = 0;
                    hours = 0;
                    minutes = 0;
                    seconds = 0;
                    window.clearInterval(interval);
                    parameters.onEnd();
                }

                fullCountDown.days.amount.textContent = days;
                fullCountDown.days.word.textContent = parameters.words.days;
                fullCountDown.hours.amount.textContent = hours;
                fullCountDown.hours.word.textContent = parameters.words.hours;
                fullCountDown.minutes.amount.textContent = minutes;
                fullCountDown.minutes.word.textContent = parameters.words.minutes;
                fullCountDown.seconds.amount.textContent = seconds;
                fullCountDown.seconds.word.textContent = parameters.words.seconds;
            };
            refresh();
            interval = window.setInterval(refresh, parameters.refresh);
        });
    };

    exports.simplyCountdown = simplyCountdown;
}(window));

if (window.jQuery) {
    (function ($, simplyCountdown) {
        'use strict';
        function simplyCountdownify(el, options) {
            simplyCountdown(el, options);
        }
        $.fn.simplyCountdown = function (options) {
            return simplyCountdownify(this.selector, options);
        };
    }(jQuery, simplyCountdown));
}