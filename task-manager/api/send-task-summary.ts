import {
    SESClient,
    SendEmailCommand,
    GetIdentityVerificationAttributesCommand,
    VerifyEmailIdentityCommand,
} from "@aws-sdk/client-ses";
import type { VercelRequest, VercelResponse } from "@vercel/node";

interface TaskSummaryRequest {
    email?: string;
    tasks?: {
        title: string;
        description: string;
        completed: boolean;
    }[];
}

export default async function handler(
    request: VercelRequest,
    response: VercelResponse
) {
    if (request.method !== "POST") {
        return response.status(405).json({
            message: "Método no permitido.",
        });
    }

    try {
        const body = request.body as TaskSummaryRequest;

        if (!body.email || !body.tasks) {
            return response.status(400).json({
                message: "Faltan datos para enviar el email.",
            });
        }

        if (
            !process.env.AWS_REGION ||
            !process.env.AWS_ACCESS_KEY_ID ||
            !process.env.AWS_SECRET_ACCESS_KEY ||
            !process.env.AWS_SES_FROM_EMAIL
        ) {
            return response.status(500).json({
                message: "Faltan variables de entorno de AWS.",
            });
        }

        const sesClient = new SESClient({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
        });

        // 1. Verificar si el email destinatario está verificado en SES
        const checkCommand = new GetIdentityVerificationAttributesCommand({
            Identities: [body.email],
        });
        const checkResult = await sesClient.send(checkCommand);
        const verificationStatus =
            checkResult.VerificationAttributes?.[body.email]?.VerificationStatus;

        // 2. Si no está verificado en SES, solicitar la verificación por email automáticamente
        if (verificationStatus !== "Success") {
            await sesClient.send(
                new VerifyEmailIdentityCommand({
                    EmailAddress: body.email,
                })
            );

            return response.status(200).json({
                status: "verification_required",
                message: `El correo ${body.email} aún no está verificado en AWS SES. Te enviamos un correo de confirmación desde AWS. Por favor hacé clic en el enlace que recibiste y volvé a presionar "Enviarme resumen".`,
            });
        }

        const completedTasks = body.tasks.filter((task) => task.completed).length;
        const pendingTasks = body.tasks.filter((task) => !task.completed).length;

        const taskList = body.tasks
            .map((task) => {
                const icon = task.completed ? "✅" : "⏳";
                const status = task.completed ? "Completada" : "Pendiente";

                return `${icon} ${task.title}

Estado: ${status}

${task.description}`;
            })
            .join("\n\n────────────────────\n\n");

        const command = new SendEmailCommand({
            Source: process.env.AWS_SES_FROM_EMAIL,
            Destination: {
                ToAddresses: [body.email],
            },
            Message: {
                Subject: {
                    Data: "Resumen de tus tareas",
                    Charset: "UTF-8",
                },
                Body: {
                    Text: {
                        Data: `📋 Resumen de tareas

✅ Completadas: ${completedTasks}
⏳ Pendientes: ${pendingTasks}

────────────────────

${taskList}

────────────────────

Generado automáticamente por Task Manager`,
                        Charset: "UTF-8",
                    },
                },
            },
        });

        await sesClient.send(command);

        return response.status(200).json({
            status: "success",
            message: "Email enviado correctamente.",
        });
    } catch (error: any) {
        console.error("SES ERROR:", error);

        return response.status(500).json({
            message: error?.message || "No se pudo enviar el email.",
        });
    }
}