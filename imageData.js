const fs = require('fs')
const path = require('path')


class imageData{
    /**
     * 
     * @param {String} filePath 
     */
    constructor (filePath) {
        this.path = filePath;
        this.files = this._initAllFiles()
    }

    _initAllFiles(){
        let fileObj = []
        const getFiles = (dir => {
            const files = fs.readdirSync(dir)
            files.forEach(file => {
                const fullPath = path.join(dir,file)
                const stats = fs.statSync(fullPath)
                if(stats.isDirectory()) getFiles(fullPath) // getFilesを再帰的に呼び出し
                else{
                    // jpg, Jpg, JPG, png, Png, PNG
                    if(!is_picture(file)) return
                    const data = {
                        createTime: stats.mtime,
                        fullPath: fullPath,
                        file : file
                    }
                    fileObj.push(data)
                }
            })
        })
        if(this.path === '') return []
        getFiles(this.path)
        fileObj = object_array_sort(fileObj, 'createTime', 'asc')
        return fileObj
    }

    showPath (){
        console.log(this.path);
    }

    /**
     * 
     * @param {String} by 
     * @param {String} order 
     * @return {Object} [{createTime,file,fullPath},{...},...]
     */
    getFiles(by ,order){
        const fileObj = object_array_sort(this.files, by, order)
        return fileObj
    }

    /**
     * 
     * @param {Object} filterObj 
     */
    filterFiles(filterObj) {
        let obj = this.files
        Object.keys(filterObj).forEach( key => {
            let obj_tmp = []
            if(key === 'datepicker') obj_tmp = date_filter(obj, filterObj.datepicker)
            obj = obj_tmp
        })
        return obj
    }

}
module.exports = imageData

const is_picture = (file_name) => {
    if(file_name.match(/jpg/) || file_name.match(/JPG/)|| file_name.match(/png/)|| file_name.match(/PNG/)) return true
    else false
}

const object_array_sort = ((data,key,order) => {
    //デフォは降順(DESC)
    var num_a = -1
    var num_b = 1

    if(order === 'asc'){//指定があれば昇順(ASC)
    num_a = 1
    num_b = -1
    }

data = data.sort(function(a, b){
    var x = a[key]
    var y = b[key]
    if (x > y) return num_a
    if (x < y) return num_b
    return 0
    })

    return data // ソート後の配列を返す
})

const date_filter = (files_obj, picker_obj) => {
    const from = (picker_obj.from == "")?
        'empty' : new Date(picker_obj.from)
    const to = (picker_obj.to == "")?
        'empty' : new Date(picker_obj.to)
    const tmp = files_obj.filter(item => {
        if ((item.createTime >= from || from === 'empty') 
            && (item.createTime <= to || to === 'empty')) return true
    })
    return tmp
}
