import { Request, Response } from "express";
import students from "../models/studentData";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const createStudent = async (req: Request, res: Response) =>{
    try{
        const {email, password} = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const studentDetail = await students.create({
            email,
            password: hashedPassword
        });
        res.status(201).json(studentDetail);
    }catch(error){
        res.status(500).json({message: "Creation Failed"})
    }
};

export const login = async (req: Request, res: Response) =>{
    try{
        const {email, password} = req.body;

        const studentData = await students.findOne({email});

        if(!studentData){
            return res.status(400).json({message: "Student Not Found"});
        }

        const checkPassword = await bcrypt.compare(password, studentData.password);

        if(!checkPassword){
            return res.status(400).json({message: "Invalid Password"});
        }

        if(!studentData.isActive){
            return res.status(403).json({message: "User DeActivated"});
        }

        const token = jwt.sign(
            {id: studentData._id},
            process.env.JWT_SECRETE as string,
            {expiresIn: "7d"}
        );

        res.status(200).json({message: "Login Successful", token});
    }catch(error){
        res.status(500).json({message: "Login Failed"});
    }
};

export const getStudents = async (req: Request, res: Response) =>{
    try{
        const fetchStudent = await students.find().select("-password");
        res.json(fetchStudent);
    }catch(error){
        res.status(500).json({message: "Cannot fetch students"});
    }
};

export const toggleLogic = async (req: Request, res: Response) =>{
    try{
        const {id} = req.params;
        const studentToggle = await students.findById(id);

        if(!studentToggle){
            return res.status(404).json({message: "Student Not found"});
        }

        studentToggle.isActive = !studentToggle.isActive
        await studentToggle.save();

        res.json({message: "Student status updated", isActive: studentToggle.isActive})
    }catch(error){
        res.status(500).json({message: "Toggle Failed"})
    }
}