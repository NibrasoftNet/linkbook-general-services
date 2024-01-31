import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { MailService } from './mail.service';
import { Mailer } from './entities/mailer.entity';
import { CreateMailerInput } from './dto/create-mailer.input';
import { UpdateMailerInput } from './dto/update-mailer.input';

@Resolver(() => Mailer)
export class MailResolver {
  constructor(private readonly mailerService: MailService) {}

/*  @Mutation(() => Mailer)
  createMailer(@Args('createMailerInput') createMailerInput: CreateMailerInput) {
    return this.mailerService.create(createMailerInput);
  }

  @Query(() => [Mailer], { name: 'mail' })
  findAll() {
    return this.mailerService.findAll();
  }

  @Query(() => Mailer, { name: 'mail' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.mailerService.findOne(id);
  }

  @Mutation(() => Mailer)
  updateMailer(@Args('updateMailerInput') updateMailerInput: UpdateMailerInput) {
    return this.mailerService.update(updateMailerInput.id, updateMailerInput);
  }

  @Mutation(() => Mailer)
  removeMailer(@Args('id', { type: () => Int }) id: number) {
    return this.mailerService.remove(id);
  }*/
}
