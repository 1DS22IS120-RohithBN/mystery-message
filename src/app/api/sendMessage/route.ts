import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { Message } from "@/models/User";

export default async function POST(request:Request){
    await dbConnect();
    const {username,content}=await request.json()
    try {
        const user = await UserModel.findOne({username})
        if(!user){
            return Response.json({
                success:false,
                message:"User not found"
            },
        {
            status:400
        })}
        if(!user.isAcceptingMessage){
            return Response.json({
                success:false,
                message:"User is not accepting messages"
                },
                {
                    status:404
                }
        )
        }
        const newMessage={content,createdAt:new Date()}
        user.messages.push(newMessage as Message)
        await user.save()
        return Response.json({
            success:true,
            message:"Message Sent Succesfully"
        },{
            status:201
        })
    } catch (error) {
        console.error(error)
        return Response.json({
            success:false,
            message:"Error sending message"
        },{
            status:500
        })
        
        
    }

}