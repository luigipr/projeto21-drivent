//import { Prisma } from '@prisma/client';
import { prisma } from '@/config';
//import { CreateTicketForPost } from '@/services';

async function getTicketTypes() {
  const ticketTypes = await prisma.ticketType.findMany();
  return ticketTypes;
}

async function getUserTicket(id: number) {
  const userTicket = await prisma.ticket.findUnique({
    where: { id },
    select: {
      id: true,
      status: true,
      ticketTypeId: true,
      enrollmentId: true,
      TicketType: {
        select: {
          id: true,
          name: true,
          price: true,
          isRemote: true,
          includesHotel: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      createdAt: true,
      updatedAt: true,
    },
  });
  return userTicket;
}

async function checkEnrollment(userId: number) {
  return await prisma.enrollment.findUnique({
    where: {
      userId,
    },
  });
}

async function checkTicket(enrollmentId: number) {
  return await prisma.ticket.findUnique({
    include: {
      TicketType: true,
    },
    where: {
      enrollmentId,
    },
  });
}

async function postTicket(ticketTypeId: number, enrollmentId: number) {
  return await prisma.ticket.create({
    data: {
      enrollmentId,
      ticketTypeId,
      status: 'RESERVED',
    },
    include: { TicketType: true },
  });
}

export const ticketsRepository = { getUserTicket, getTicketTypes, checkEnrollment, checkTicket, postTicket };
