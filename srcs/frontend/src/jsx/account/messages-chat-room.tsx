import "../../scss/common-classes.scss";
import "../../scss/messages.scss"
import { useTranslation } from "react-i18next";

function ChatRoom(){
    const { t } = useTranslation();

    return (
        <>
            <div className="chat-header">
                {t('common.chatting-with')}      
            </div>
            
            <div className="message-left">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum ab voluptate incidunt. Nam neque alias officia optio quibusdam aut, harum debitis suscipit dignissimos at nihil ex commodi, quidem, rerum amet.
            </div>
            <div className="message-right">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore obcaecati ullam labore beatae illo, dolorem repellat fugiat ducimus quasi eos quaerat perspiciatis explicabo animi, iste maiores dolor repellendus totam impedit!
            </div>
            <div className="message-left">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Accusantium qui labore voluptas quibusdam voluptatum, consectetur distinctio repudiandae obcaecati eaque quod et perspiciatis officiis, at commodi, eos enim itaque quia sint!
            </div>
            <div className="message-left">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ratione voluptatibus veritatis suscipit esse laudantium voluptatem, ipsa laboriosam vel libero hic, nihil at magni mollitia, quasi aspernatur ea tempora enim. Ex?
            </div>
            <div className="message-right">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magni blanditiis cumque explicabo nobis dignissimos non? Necessitatibus perspiciatis mollitia dignissimos repellat, dicta soluta odit voluptates consequuntur, a totam deserunt, perferendis temporibus!
            </div>
            <textarea className="message-area" name="new-message" placeholder="Type your message here"></textarea>
            <figure className="icon-send-nessage">
                <input type="button" className="send-message" value={t('common.send')}/>
            </figure>
        </>
    )
}

export default ChatRoom;