interface TokenInterface {
  userId: number;
  uuid: string;
  sessionId: string;
  iat: number;
  exp: number;
  iatFormat: string;
  expFormat: string;

  refreshToken: string;
}
export default TokenInterface;
