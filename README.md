The plugin profiles calls to `jQuery(selector)`, so that you can see which calls to jQuery are taking time.

This plugin is meant to complement tools such as the Firebug profiler, which profile all the function calls in your script, but don't (at present) allow you to drill down into the different arguments to a single call.

Call `$.profile.start()` to start profiling calls to `$(selector)`, and then `$.profile.done()` to stop profiling and print out something like this:

    Selector                 Count  Total  Avg+/-stddev
    script, script, scri...  100    101ms  1.01ms+/-1.01
    script                   200     58ms  0.29ms+/-0.53
    html body #output        100     55ms  0.55ms+/-0.74
    script, #output          100     54ms  0.54ms+/-0.73
    #output                  100      6ms  0.06ms+/-0.24

You can also include the `?jquery.profile.start` query parameter in your page URL to begin profiling automatically as soon as the plugin is loaded.

## Contributors

* Oliver Steele author
* Joe Coutcher updated to modern jQuery

## Links

* [Announcement](http://osteele.com/posts/2008/05/jquery-profile-plugin)
* [Github](https://github.com/osteele/jquery-profile)
* [jQuery plugin directory](http://archive.plugins.jquery.com/project/profile)
