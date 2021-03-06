const fs = require('fs')
const path = require('path')
const $ = require('jQuery')
const datepicker = require('js-datepicker')
const imageData = require('./imageData')

const rootDir = ''
let imgs = new imageData(rootDir)

// ready時の挙動（index.htmlに記述していないDOM操作の順番に注意）
$(() => {
    // 最初に画像を降順で全部出す
    const files = imgs.getFiles('createTime', 'dsc')
    reRender_picture_list(files)

    // datepickerの初期化
    const dp_custom1 = {
        position: 'br',
        formatter: (el, date, instance) => { el.value = dateFormat(date)}
    }
    const dp_custom2 = {
        position: 'br',
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
    if(typeof $('#directry_selecter')[0].files[0] == 'undefined') return
    const inputMode = $('#directry_selecter').attr('mode')

    let dirPath = $('#directry_selecter')[0].files[0].path
    if(inputMode == 'nomal'){
        $('#directry_selecter_label').html($('#directry_selecter')[0].files[0].name)
    }else if(inputMode == 'iPhone'){
        $('#directry_selecter_label').html('DCIM')

        const exist_DCIM = dirPath.indexOf("DCIM")
        if(exist_DCIM == -1) dirPath = path.dirname(dirPath)
        else dirPath = dirPath.substring(0, exist_DCIM+4)
    }else{
        return
    }
    console.log(dirPath)

    delete imgs
    imgs = new imageData(dirPath)
    const files = imgs.getFiles('createTime', 'dsc')
    reRender_picture_list(files)
})

// ディレクトリ選択の切り替え
$('#dir_mode_change').on('click', () => {
    const inputMode = $('#directry_selecter').attr('mode')
    if(inputMode == 'nomal') {
        $('#directry_selecter').attr('mode','iPhone')
        $('#directry_selecter').removeAttr('webkitdirectory')
    }else {
        $('#directry_selecter').attr('mode','nomal')
        $('#directry_selecter').attr('webkitdirectory','')
    }
})


/**
 * 画像リストの再描写
 * @param {Object} files 
 */
const reRender_picture_list = (files) =>{
    $('#picture_list').empty()
    //console.log(files)
    let y = 0
    let m = 0
    let d = 0 
    files.forEach(f => {
        const tmpY = f.createTime.getFullYear()
        const tmpM = f.createTime.getMonth()+1
        const tmpD = f.createTime.getDate()
        if(y != tmpY || m != tmpM || d != tmpD){
            const strDate = (y != tmpY)?
                tmpY+"-"+tmpM+"-"+tmpD : tmpM+"-"+tmpD
            y = tmpY
            m = tmpM
            d = tmpD

            $('#picture_list').append('<h1 class="date_header">'+strDate+'</h1>')
        }

        $('#picture_list').append('<div class="picture_box"></div>')
        $("#picture_list > .picture_box:last").append('<img class="picture img-thumbnail" src="'+f.fullPath+'">')
        $("#picture_list > .picture_box:last").append('<input class="disabled_checkbox" type="checkbox" checked />')
    })

    if(Object.keys(files).length == 0){

        $("#picture_list").append('<div id="no_picture" class="no_picture"></div>')
        $("#no_picture").append('<h1>表示フォルダを選択してください</h1>')
    }

    // 選択時，画像のcheckedクラス付与/解除
    $('.picture').on('click', (eo) => {
        if ($(eo.target).hasClass('checked')) $(eo.target).removeClass('checked')
        else $(eo.target).addClass('checked')
    });

    // 画像のチェックボックス無効化
    $('.disabled_checkbox').on('click', () => {
        return false
    })
}

// 転送先フォルダ決定でフォルダ名表示
$('#transfer_target').change(()=>{
    if(typeof $('#transfer_target')[0].files[0] == 'undefined') return
    $('#transfer_target_label').html($('#transfer_target')[0].files[0].name)
})

// 転送ボタンを押してコピー
$('#transfer_subbmit').on('click', () => {
    if(typeof $('#transfer_target')[0].files[0] == 'undefined') return
    const targetPath = $('#transfer_target')[0].files[0].path

    $("img.checked").each((i,e) => {
        const originalData = e.getAttribute('src')
        const copyData = path.join(targetPath, path.basename(originalData) )

        fs.copyFile(originalData, copyData, (err) => {
            if (err) {
                throw err
            }
            console.log(originalData+ ' ->' + copyData )
            $("#tansfer_status").append("<p>"+path.basename(originalData)+"の転送が完了しました<p>")
        })
    })
    
})

// 画像選択解除
$('#remove_checked').on('click', ( )=> {
    $('.picture').removeClass('checked')
})

