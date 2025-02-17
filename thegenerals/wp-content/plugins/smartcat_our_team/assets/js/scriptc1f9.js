jQuery(document).ready(function ($) {

    $('.team_member_link').click(function (e) {

        var member = $(this).parents('.sc_team_member');

        var inline = $('#' + $(this).parents('.ots-team-view').data('id'))
                                .find('#inline-' + member.data('id'));

        if (inline.hasClass('sc_our_team_panel')) {

            e.preventDefault();

            inline.parent()
                .fadeIn(350, function () {

                    inline.addClass('slidein');
                    $(this).addClass('show');

                });

            inline.find('.sc_team_icon-close').click(function () {

                inline.removeClass('slidein');

                inline.parent()
                    .removeClass('show')
                    .delay(450)
                    .fadeOut(300);

            });

        } else if (inline.hasClass('sc_our_team_lightbox')) {

            e.preventDefault();

            inline.parent().fadeIn(350, function () {

                inline.css('opacity', 0)
                    .slideDown('slow')
                    .animate(
                        {
                            opacity: 1
                        },
                        {
                            queue: false,
                            duration: 'slow'
                        }
                    );

            }).addClass('show');

            inline.find('.sc_team_icon-close').click(function () {

                inline.slideUp(300, function () {

                    inline.parent()
                        .fadeOut(300);

                });

                inline.parent()
                    .removeClass('show');

            });

        }

    });

    function doMasonry() {

        var $grid = $("#sc_our_team.masonry");

        if ($grid.length > 0) {

            $grid.imagesLoaded(function () {

                $grid.masonry(
                    {
                        itemSelector: '.sc_team_member',
                        columnWidth: '.grid-sizer',
                        percentPosition: true,
                        gutter: '.gutter-sizer',
                        transitionDuration: '.75s'
                    }
                );

            });

            var col_width = null;

            if ($("#sc_our_team.masonry").hasClass('sc-col2')) {

                col_width = '48%';

            } else if ($("#sc_our_team.masonry").hasClass('sc-col3')) {

                col_width = '32%';

            } else if ($("#sc_our_team.masonry").hasClass('sc-col4')) {

                col_width = '23.5%';

            } else if ($("#sc_our_team.masonry").hasClass('sc-col5')) {

                col_width = '18.4%';

            } else {

                col_width = '8.2%';

            }

            if ($(window).width() >= 992) {

                $('#sc_our_team.masonry .gutter-sizer').css('width', '2%');
                $('#sc_our_team.masonry .grid-sizer').css('width', col_width);
                $('#sc_our_team.masonry .sc_team_member').css('width', col_width);

            } else if ($(window).width() < 992 && $(window).width() >= 768) {

                $('#sc_our_team.masonry .gutter-sizer').css('width', '2%');
                $('#sc_our_team.masonry .grid-sizer').css('width', '48%');
                $('#sc_our_team.masonry .sc_team_member').css('width', '48%');

            } else {

                $('#sc_our_team.masonry .gutter-sizer').css('width', '0%');
                $('#sc_our_team.masonry .grid-sizer').css('width', '100%');
                $('#sc_our_team.masonry .sc_team_member').css('width', '100%');

            }

        }

    }

    // Call Masonry on window size and load
    $(window).resize(function () {

        doMasonry();

    });

    doMasonry();


    /**
     * Grid 2
     */

    $('#sc_our_team.grid2 .sc_team_member_inner .image-container').mouseenter(function () {

        $(this).find('.image-corner')
            .stop()
            .animate(
                {
                    height: "75px"
                },
                200
            );

        $(this).find('.icon')
            .stop()
            .animate(
                {
                    fontSize: "20px",
                    opacity: "1"
                },
                400
            );

    }).mouseleave(function () {

        $(this).find('.icon')
            .stop()
            .animate(
                {
                    fontSize: "0px",
                    opacity: "0"
                },
                200
            );

        $(this).find('.image-corner')
            .stop()
            .animate(
                {
                    height: "0px"
                },
                400
            );

    });

    /**
     * Carousel
     */

    var carousel = $('#sc_our_team.carousel');

    if (carousel.length > 0) {
        carousel.owlCarousel({
            items: ots_pro.grid_columns,
            autoPlay: ots_pro.carousel_speed ? ots_pro.carousel_speed : false
        });
    }

    /**
     * Staff Directory
     */

    var directory = $('.sc-team-table');

    if ( directory.length > 0 ) {
        directory.DataTable({
            language: {
                search: ots_pro.search_label,
                emptyTable: ots_pro.string_dt_empty_table,
                zeroRecords: ots_pro.string_dt_zero_records,
                info: ots_pro.string_dt_info,
                infoFiltered: ots_pro.string_dt_info_filtered,
                infoEmpty: ots_pro.string_dt_info_empty,
                lengthMenu: ots_pro.string_dt_length_menu,
                paginate: {
                    next: ots_pro.string_dt_paginate_next,
                    previous: ots_pro.string_dt_paginate_prev
                }
            },
            filter: Boolean(ots_pro.directory_search),
            paging: ots_pro.directory_pagination,
            sorting: ots_pro.sort_directory ? [[0, 'asc']] : [],
            responsive: true
        });
    }

    /**
     * Grid Search bar
     * Frontend Search & Sort UI
     * 
     * @since 4.3.0
     */
    var search = $( '.ots-search-bar' )    
    var filter = $( '#sc_our_team_filter' )    
    if( search.length > 0 || filter.length > 0 ) {
       

        var search_trigger = $( '.ots-search-button' )
        var reset_trigger = $( '.ots-search-reset-button' )
        
        // Trigger search on Enter 
        $('body').on( 'keypress', search_trigger, function( e ) {
            
            if( e.which == 13 ) {
                search_trigger.click()
            }
            
        })
        
        // Search team members for text
        // This filters who can be viewed based on 
        // search text & group
        search_trigger.click( function( e ) {
            
            var container = $( this ).parent( '.ots-team-view' )
            var search_text = $( '.ots-search-bar', container ).val().toLowerCase()
            var search_group = $( '.ots-search-group', container ).val()
            
            hideAll( container )

            // reset Group filtering to ALL
            $('#sc_our_team_filter ul.filter-list li', container ).removeClass('active-filter')
            
            $( '.sc_team_member', container ).each( function() {


                if( search_group ) {

                    if( $(this).attr('data-group' ).includes( search_group ) 
                        && $(this).html().toLowerCase().includes( search_text ) ) {
                        
                        revealItem( $(this) )
                        
                    }

                }else{
                    if( $(this).html().toLowerCase().includes( search_text ) ) {
                        revealItem( $(this) )
                    }                        
                }
                
            })
            
            
            doMasonry()
            
        })
        

        
        // Reset button click
        reset_trigger.click( function( e ) {
            var container = $( this ).parent( '.ots-team-view' )
            displayAll( container )
            $('.ots-search-group', container ).val('')
            doMasonry()
            
        })
        
        function revealItem( item ) {
            item.show()
        }
        
        function hideAll( container ) {
            $( '.sc_team_member', container ).hide()
        }
        
        
        function displayAll( container ) {
            $( '.sc_team_member', container ).show()
        }
        
        function getMemberGroups( member ) {
            
            var groups = $(this).attr('data-group')
            
            return groups.split(';')
            
        }
        
        
        
        /**
         * 
         * Filter by groups
         * 
         * 
         */

        $('.ots-team-view').each(function () {
            var $container = $(this);
            var groups = ['all'];

            $container.find('.sc_team_member').each(function () {
                ($(this).data('group') || '').split(';').forEach(function (group) {
                    if (groups.indexOf(group) < 0) {
                        groups.push(group);
                    }
                });
            });

            $container.find('.filter-list li').each(function () {
                if (groups.indexOf($(this).data('group')) < 0) {
                    $(this).remove();
                }
            });

            $container.find('.ots-search-group option').each(function () {
                var group = $(this).data('group');

                if (group && groups.indexOf(group) < 0) {
                    $(this).remove();
                }
            });
        });


        var selected = [];

        // update groups
        $('#sc_our_team_filter ul.filter-list li').click(function () {
            var container = $( this ).parents( '.ots-team-view' ),
                group = $(this).data('group'),
                id = container.attr('data-id');

                if (!selected[id]) {
                    selected[id] = []
                }

                if (group === 'all') {
                    selected[id] = []
                } else if (selected[id].indexOf(group) > -1) {
                    selected[id].splice(selected[id].indexOf(group), 1)
                } else {
                    selected[id].push(group)
                }

            $('.filter-list li', container).each(function() {
                var $this = $(this);
                $this.removeClass('active-filter');

                if (!selected[id].length && $this.data('group') === 'all') {
                    $this.addClass('active-filter');
                } else if (selected[id].indexOf($this.data('group')) > -1) {
                    $this.addClass('active-filter');
                }
            });

            doFilter(container)
            doMasonry()
            
        })
        
        function doFilter( container ) {
            
            hideAll( container )
            var id = container.attr( 'data-id' );
            var groups = selected[id];
            
            $('.sc_team_member', container ).each( function() {
                var memberGroups = $(this).attr('data-group').split(';')
                
                if (findOne( groups, memberGroups ) || !groups.length) {
                    revealItem(  $(this) )}
                
            })
            
        }
        
        function findOne ( haystack, arr ) {
            return arr.some(function (v) {
                return haystack.indexOf(v) >= 0;
            })
        }

        
    }
    

});
