const $ = require('jQuery')
const datepicker = require('js-datepicker')
const imageData = require('./imageData')

//const rootDir = 'C:\\Users\\shiso\\Documents\\picTra\\picDir'
const rootDir = ''
let imgs = new imageData(rootDir)

// ready時の挙動
$(() => {
    // 最初に画像を降順で全部出す
    const files = imgs.getFiles('createTime', 'dsc')
    reRender_picture_list(files)

    // datepickerの初期化
    const dp_custom1 = {
        formatter: (el, date, instance) => { el.value = dateFormat(date)}
    }
    const dp_custom2 = {
        formatter: (el, date, instance) => { el.value = dateFormat(date)}
    }
    const dateFormat = (date) =>{
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        var d = date.getDate();
        return y+"/"+m+"/"+d
    }
    datepicker('#datepicker_from',dp_custom1);
    datepicker('#datepicker_to',dp_custom2);
})

// datepickerを押したらフィルタリングして再表示
$('#datepicker_subbmit').on('click', () => {
    const filters = {
        datepicker:{
            from: $('#datepicker_from').val(),
            to: $('#datepicker_to').val()
        }
    }
    const files = imgs.filterFiles(filters)
    reRender_picture_list(files)
})

// フィルタリングのリセット
$('#datepicker_reset').on('click', () => {
    $('#datepicker_from').val('')
    $('#datepicker_to').val('')
})

// ディレクトリ選択
$('#directry_selecter').change(()=>{
    const path = $('#directry_selecter')[0].files[0].path
    console.log()

    imgs = new imageData(path)
    const files = imgs.getFiles('createTime', 'dsc')
    reRender_picture_list(files)
})

/**
 * 画像リストの再描写
 * @param {Object} files 
 */
const reRender_picture_list = (files) =>{
    $('#picture_list').empty()
    console.log(files)
    files.forEach(f => {
        $('#picture_list').append('<img class="picture" src="'+f.fullPath+'" alt="">');
    })
}