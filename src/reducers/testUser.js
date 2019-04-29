/*
    参数名称	含义	备注
    msg	执行信息	success表示成功，其它是错误信息
    userAc	用户账号
    userName	用户名称
    userPhone	联系方式
    userMail	用户邮箱
    userTeam	团队/处室
    userComp	单位
    userStatus	用户状态	1有效 2无效
    userPkfgl	库房管理权限	1 普通用户
                            2审批用户
                            3 管理用户
    userPsggl	施工管理权限	同上
*/

export default function() {
    return (
        {
            "msg": "success",
            "userAc": "wuhaojian",
            "userName": "吴浩坚",
            "userPhone": "18601180179",
            "userMail": "wuhaojian@picc.com.cn",
            "userTeam": "运行管理处",
            "userComp": "人保财险",
            "userStatus": "1",
            "userPkfgl": "3",
            "userPsggl": "3"
        });
}
