export function checkFiled(val) {
    var msg=''
    if(val.is_required==1 && (val.value=='' || val.value==null)){
       return  msg='该项值不能为空';
        
    }
    if(val.regular_text!=''){
        try {
            var reg=eval(val.regular_text).test(val.value);
            if(reg){
                msg='';
            }else{
                //msg=`输入的值不为${val.field_format.name},请重新输入`;
                msg=`输入的值不合规范,请重新输入`;
                return msg
            }
            return msg
        } catch (err) {
        }
    }
    return msg
    //var reg=new RegExp(val.regular_text).test(val.pro_default_value);有//则用eval
    //(/^\s+$/gi.test(value))
}