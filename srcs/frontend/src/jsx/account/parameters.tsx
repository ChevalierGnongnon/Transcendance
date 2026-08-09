

function Parameters() {
    return (
        <>
            <div className="update-div">
                <form className="login-form d-flex flex-column align-items-center gap-3">
                    <h3>Change my password</h3>
                    <span>Old password:</span>
                    <input type="password" name="" id="" />
                    <span>New password:</span>
                    <input type="password" name="" id="" />
                    <span>Confirm new password:</span>
                    <input type="password" name="" id="" />
                    <input type="button" value="Change my password" />
                </form>
                <form className="login-form d-flex flex-column align-items-center gap-3">
                    <h3>Change account infos</h3>
                    <span>Change account first name:</span>
                    <input type="text" name="" id="" />
                    <span>Change account last name:</span>
                    <input type="text" name="" id="" />
                    <span>Change account pseudo:</span>
                    <input type="text" name="" id="" />
                    <input type="button" value="Change my password" />
                </form>
                <form className="login-form d-flex flex-column align-items-center gap-3">
                    <span>Change my profile photo:</span>
                    <input type="file" name="" id="" />
                    <input type="button" value="Change my profile photo" />
                </form>
                
            </div>


        </>
    )
}

export default Parameters;