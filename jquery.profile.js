/*
* JQuery Profile Plugin
* Version 1.0
* http://plugins.jquery.com/project/profile
*
* Copyright 2008 by Oliver Steele
* Dual licensed under the MIT and GPL Licenses:
* http://www.opensource.org/licenses/mit-license.php
* http://www.gnu.org/licenses/gpl.html
* 
* 2012-10-08: Updated by Joe Coutcher to support newer versions of jQuery (tested with 1.7.2...may work with others)
*             Fork: https://github.com/jcoutch/jquery-profile/
*/

/**
* Log calls to jQuery(selector), and display their timings.
*
* Usage:
*   jQuery.profile.start();
*   // do some stuff
*   jQuery.profile.done();
*
* Or, include ?jquery.profile.start in the url to start profiling when the
* this script is loaded.  You will still need to call .done() to see the
* report.
*
* @type jQuery
* @name profile
* @author Oliver Steele (steele@osteele.com)
*/
(function ($) {
    var profile = $.profile = start;

    var stats,
        statsIndex,
        savedInit;
    $.extend(profile, {
        done: function () { this.stop(); this.report() },
        start: start,           // $.extend ignores this, so we set it below
        reset: reset,
        report: function (options) {
            options = options || {};
            stats.sort(function (a, b) { return b.total - a.total });
            var rows = [],
                ellipsisPattern = new RegExp('(.{' + (options.maxSelectorLength || 20) + '}).*');
            rows.push(['Selector', 'Count', 'Total', 'Avg+/-stddev']);
            for (var i = 0; i < Math.min(options.limit || 10, stats.length); i++) {
                var entry = stats[i],
                    n = entry.count,
                    x = entry.total / n,
                    sd = Math.sqrt((n * entry.squares - x * x) / (n * (n - 1)));
                rows.push([entry.selector.replace(ellipsisPattern, '$1...'),
                           n,
                           entry.total + 'ms',
                           (x + (n > 1 ? 'ms+/-' + sd : 'ms')).replace(/(\.\d\d)\d+/g, '$1')]);
            }
            this.printTable(rows, { 0: { align: 'left' }, 3: { align: 'left'} });
        },
        printTable: function (rows, options) {
            var widths = [], padstr = ' ';
            for (var i = 0; i < rows.length; i++)
                for (var j = 0; j < rows[i].length; j++)
                    widths[j] = Math.max(widths[j] || 0, String(rows[i][j]).length);
            for (var i = 0; i < rows.length; i++) {
                var row = rows[i], fields = [];
                for (var j = 0; j < row.length; j++) {
                    var padlen = widths[j] - String(row[j]).length;
                    while (padstr.length < padlen) padstr += padstr;
                    var pad = padstr.slice(0, padlen),
                        left = (options[j] || {}).align == 'left';
                    left || fields.push(pad);
                    fields.push(row[j]);
                    left && fields.push(pad);
                }
                console.info(fields.join(' '));
            }
        },
        stop: function () {
            if (savedInit) {
                jQuery.fn.init = savedInit;
                savedInit = null;
            }
        }
    });
    profile.start = start;

    function start() {
        reset();
        
        $(function () {
            if (window.location.search.match(/[\?&]jquery.profile.start\b/)) {
                $(document.body).append(
                    $("<button onclick='$.profile.done(); $(this).remove();' style='position: absolute; right: 0px; top: 0px; z-index: 9001' />").html("Stop Profiling<br/>(Output to Console)")
                );
            }
        });

        savedInit = jQuery.fn.init;

        jQuery.fn.init = jQuery.prototype.init = function (selector, context, rootjQuery) {
            context = context || window.document;

            var t0 = new Date;
            var result = new savedInit(selector, context, rootjQuery);
            var dt = new Date - t0;

            if (typeof selector == 'string') {
                var entry = statsIndex[selector];
                if (!entry) {
                    entry = statsIndex[selector] = {
                        selector: selector,
                        count: 0,
                        total: 0,
                        squares: 0
                    }
                    stats.push(entry);
                }
                entry.count += 1;
                entry.total += dt;
                entry.squares += dt * dt;
            }
            
            return result;
        };

        console.info("jQuery profiling started...");
    }
    function reset() {
        stats = [];
        statsIndex = {};
    }
})(jQuery);

if (window.location.search.match(/[\?&]jquery.profile.start\b/))
    jQuery.profile();